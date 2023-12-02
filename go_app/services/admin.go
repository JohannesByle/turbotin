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
	CAT_CYCLE    = errors.New("Category cycle detected")
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
	}
	seenTags[id] = false
	return nil
}

func recurseCats(id int, catMap map[int]map[int]bool, seenCats map[int]bool) error {
	_, seen := seenCats[id]
	if seen {
		return CAT_CYCLE
	}
	seenCats[id] = true
	children, ok := catMap[id]
	if !ok {
		return nil
	}
	for childId := range children {
		err := recurseCats(childId, catMap, seenCats)
		if err != nil {
			return err
		}
	}
	seenCats[id] = false
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
	for catId := range seenCats {
		if err := recurseCats(catId, seenCats, map[int]bool{}); err != nil {
			return err
		}
	}
	return nil
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

func (s *Admin) DeleteTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		tags := []*models.Tag{}
		for _, tag := range req.Msg.Items {
			tags = append(tags, &models.Tag{Model: gorm.Model{ID: uint(tag.Id)}})
		}
		if err := tx.Unscoped().Delete(tags).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
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

func (s *Admin) DeleteCategories(ctx context.Context, req *Request[pb.CategoryList]) (*Response[pb.EmptyArgs], error) {
	err := DB.Transaction(func(tx *gorm.DB) error {
		cats := []*models.Category{}
		for _, cat := range req.Msg.Items {
			cats = append(cats, &models.Category{Model: gorm.Model{ID: uint(cat.Id)}})
		}
		if err := tx.Unscoped().Delete(cats).Error; err != nil {
			return err
		}
		return assertStructureValid(tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}
