package services

import (
	"context"
	"errors"

	"turbotin/models"
	pb "turbotin/protos"
	. "turbotin/util"

	. "connectrpc.com/connect"
	"gorm.io/gorm"
)

type Admin struct{}

var (
	MISSING_CAT  = errors.New("Missing category")
	TAG_CYCLE    = errors.New("Tag cycle detected")
	INVALID_CAT  = errors.New("Invalid category hierarchy")
	NON_ROOT_CAT = errors.New("Tobacco links must all be root categories")
)

func recurse(id int, tagMap map[int][]int, catMap map[int]int, seenTags map[int]bool, seenCats map[int]map[int]bool) error {
	catId, ok := catMap[id]
	if !ok {
		return MISSING_CAT
	}

	_, seen := seenTags[id]
	if seen {
		return TAG_CYCLE
	}
	seenTags[id] = true

	_, ok = seenCats[catId]
	if !ok {
		seenCats[catId] = map[int]bool{}
	}

	children, ok := tagMap[id]
	if !ok {
		return nil
	}

	for _, tagId := range children {
		childCatId, ok := catMap[tagId]
		if !ok {
			return MISSING_CAT
		}
		seenCats[catId][childCatId] = true

		err := recurse(tagId, tagMap, catMap, seenTags, seenCats)
		if err != nil {
			return err
		}
		if len(seenTags) != len(seenCats) {
			return TAG_CYCLE
		}

	}
	seenTags[id] = false
	return nil

}

func assertStructureValid(tx *gorm.DB) error {
	catMap := map[int]int{}
	tags := []*models.Tag{}
	if err := tx.Find(&tags).Error; err != nil {
		return err
	}
	for _, tag := range tags {
		catMap[int(tag.ID)] = int(tag.CategoryId)
	}

	tobaccoLinks := []*models.TobaccoToTag{}
	rootCats := map[int]bool{}
	if err := tx.Find(&tobaccoLinks).Error; err != nil {
		return err
	}
	for _, tobaccoLink := range tobaccoLinks {
		tagId := int(tobaccoLink.TagId)
		cat, ok := catMap[tagId]
		if !ok {
			return MISSING_CAT
		}
		rootCats[cat] = true
	}

	tagMap := map[int][]int{}
	links := []*models.TagToTag{}
	if err := tx.Find(&links).Error; err != nil {
		return err
	}
	for _, link := range links {
		parentTagId := int(link.ParentTagId)
		tagId := int(link.TagId)
		_, ok := tagMap[parentTagId]
		if !ok {
			tagMap[parentTagId] = []int{}
		}
		tagMap[parentTagId] = append(tagMap[parentTagId], tagId)

		cat, ok := catMap[tagId]
		if !ok {
			return MISSING_CAT
		}
		if rootCats[cat] {
			return NON_ROOT_CAT
		}

	}

	seenCats := map[int]map[int]bool{}
	for _, tag := range tags {
		err := recurse(int(tag.ID), tagMap, catMap, map[int]bool{}, seenCats)
		if err != nil {
			return err
		}
	}
	for catId, children := range seenCats {
		for childId := range children {
			otherChildren, ok := seenCats[childId]
			if ok && otherChildren[catId] {
				return INVALID_CAT
			}

		}
	}
	return nil
}

func (s *Admin) GetTobaccoToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TobaccoToTagList], error) {
	tags := []*models.TobaccoToTag{}
	DB.Find(&tags)
	resp := &pb.TobaccoToTagList{Items: []*pb.TobaccoToTag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.TobaccoToTag{
			Id:        uint32(tag.ID),
			TagId:     uint32(tag.TagId),
			TobaccoId: uint32(tag.TobaccoId),
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetTobaccoToTags(ctx context.Context, req *Request[pb.TobaccoToTagList]) (*Response[pb.EmptyArgs], error) {
	DB.Transaction(func(tx *gorm.DB) error {
		links := []*models.TobaccoToTag{}
		for _, link := range req.Msg.Items {
			links = append(links, &models.TobaccoToTag{
				TagId:     uint(link.TagId),
				TobaccoId: uint(link.TobaccoId),
				Model:     gorm.Model{ID: uint(link.Id)},
			})
		}
		if err := tx.Save(links).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) GetTagToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagToTagList], error) {
	tags := []*models.TagToTag{}
	DB.Find(&tags)
	resp := &pb.TagToTagList{Items: []*pb.TagToTag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.TagToTag{
			Id:          uint32(tag.ID),
			TagId:       uint32(tag.TagId),
			ParentTagId: uint32(tag.ParentTagId),
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetTagToTags(ctx context.Context, req *Request[pb.TagToTagList]) (*Response[pb.EmptyArgs], error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		links := []*models.TagToTag{}
		for _, link := range req.Msg.Items {
			links = append(links, &models.TagToTag{
				TagId:       uint(link.TagId),
				ParentTagId: uint(link.ParentTagId),
				Model:       gorm.Model{ID: uint(link.Id)},
			})
		}
		if err := tx.Save(links).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) GetTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagList], error) {
	tags := []*models.Tag{}
	DB.Find(&tags)
	resp := &pb.TagList{Items: []*pb.Tag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.Tag{
			Id:         uint32(tag.ID),
			Value:      tag.Value,
			CategoryId: uint32(tag.CategoryId),
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		tags := []*models.Tag{}
		for _, tag := range req.Msg.Items {
			tags = append(tags, &models.Tag{
				Value:      tag.Value,
				CategoryId: uint(tag.GetCategoryId()),
				Model:      gorm.Model{ID: uint(tag.Id)},
			})
		}
		if err := tx.Save(tags).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) GetCategories(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.CategoryList], error) {
	cats := []*models.Category{}
	DB.Find(&cats)
	resp := &pb.CategoryList{Items: []*pb.Category{}}
	for _, cat := range cats {
		resp.Items = append(resp.Items, &pb.Category{
			Id:   uint32(cat.ID),
			Name: cat.Name,
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetCategories(ctx context.Context, req *Request[pb.CategoryList]) (*Response[pb.EmptyArgs], error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		cats := []*models.Category{}
		for _, cat := range req.Msg.Items {
			cats = append(cats, &models.Category{
				Name:  cat.Name,
				Model: gorm.Model{ID: uint(cat.Id)},
			})
		}
		if err := tx.Save(cats).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}
