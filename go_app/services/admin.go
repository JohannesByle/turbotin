package services

import (
	"context"
	"errors"

	"turbotin/ent"
	pb "turbotin/protos"

	. "turbotin/util"

	. "connectrpc.com/connect"
)

type Admin struct{}

var (
	MISSING_CAT  = errors.New("missing category")
	TAG_CYCLE    = errors.New("tag cycle detected")
	CAT_CYCLE    = errors.New("category cycle detected")
	NON_ROOT_CAT = errors.New("tobacco links must all be root categories")
	CAT_BRANCH   = errors.New("one child has more than one parent in a single category")
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

func AssertStructureValid(ctx context.Context, tx *ent.Tx) error {
	catMap := map[int]int{}

	tags, err := tx.Tag.Query().WithCategory().All(ctx)
	if err != nil {
		return err
	}
	for _, tag := range tags {
		catMap[int(tag.ID)] = int(tag.Edges.Category.ID)
	}

	rootCats := map[int]bool{}
	tobaccoLinks, err := tx.TobaccoToTag.Query().WithTag().All(ctx)
	if err != nil {
		return err
	}
	for _, tobaccoLink := range tobaccoLinks {
		tagId := int(tobaccoLink.Edges.Tag.ID)
		cat, ok := catMap[tagId]
		if !ok {
			return MISSING_CAT
		}
		rootCats[cat] = true
	}

	tagMap := map[int][]int{}
	links, err := tx.TagToTag.Query().WithParentTag().WithTag().All(ctx)

	if err != nil {
		return err
	}
	for _, link := range links {
		parentTagId := int(link.Edges.ParentTag.ID)
		tagId := int(link.Edges.Tag.ID)
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

	// No blends with multiple brands
	seenCats = map[int]map[int]bool{}
	for _, link := range links {
		parent := link.Edges.ParentTag.ID
		child, ok := catMap[link.Edges.Tag.ID]
		if !ok {
			return MISSING_CAT
		}
		_, ok = seenCats[parent]
		if !ok {
			seenCats[parent] = map[int]bool{}
		}

		if seenCats[parent][child] {
			return CAT_BRANCH
		}
		seenCats[parent][child] = true
	}
	return nil
}

func (s *Admin) UpdateTobaccoToTag(ctx context.Context, req *Request[pb.TobaccoToTag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.TobaccoToTag.UpdateOneID(int(item.Id)).
			SetTagID(int(item.TagId)).
			SetTobaccoID(int(item.TobaccoId)).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) CreateTobaccoToTag(ctx context.Context, req *Request[pb.TobaccoToTag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.TobaccoToTag.Create().
			SetTagID(int(item.TagId)).
			SetTobaccoID(int(item.TobaccoId)).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) CreateTobaccoToTags(ctx context.Context, req *Request[pb.TobaccoToTagList]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		items := req.Msg.Items
		_, err := tx.TobaccoToTag.MapCreateBulk(items, func(c *ent.TobaccoToTagCreate, i int) {
			item := items[i]
			c.SetTagID(int(item.TagId)).
				SetTobaccoID(int(item.TobaccoId)).
				Save(ctx)
		}).Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) UpdateTagToTag(ctx context.Context, req *Request[pb.TagToTag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.TagToTag.UpdateOneID(int(item.Id)).
			SetTagID(int(item.TagId)).
			SetParentTagID(int(item.ParentTagId)).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)

	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) CreateTagToTag(ctx context.Context, req *Request[pb.TagToTag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.TagToTag.Create().
			SetTagID(int(item.TagId)).
			SetParentTagID(int(item.ParentTagId)).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) UpdateTag(ctx context.Context, req *Request[pb.Tag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.Tag.UpdateOneID(int(item.Id)).
			SetCategoryID(int(item.CategoryId)).
			SetValue(item.Value).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) CreateTag(ctx context.Context, req *Request[pb.Tag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.Tag.Create().
			SetCategoryID(int(item.CategoryId)).
			SetValue(item.Value).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) DeleteTag(ctx context.Context, req *Request[pb.Tag]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		err := tx.Tag.DeleteOneID(int(item.Id)).Exec(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) UpdateCategory(ctx context.Context, req *Request[pb.Category]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.Category.UpdateOneID(int(item.Id)).
			SetName(item.Name).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) CreateCategory(ctx context.Context, req *Request[pb.Category]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		_, err := tx.Category.Create().
			SetName(item.Name).
			Save(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}

func (s *Admin) DeleteCategory(ctx context.Context, req *Request[pb.Category]) (*Response[pb.EmptyArgs], error) {
	err := WithTx(ctx, DB, func(tx *ent.Tx) error {
		item := req.Msg
		err := tx.Category.DeleteOneID(int(item.Id)).Exec(ctx)
		if err != nil {
			return err
		}
		return AssertStructureValid(ctx, tx)
	})
	if err != nil {
		return FlashError[pb.EmptyArgs](err.Error(), CodeInvalidArgument)
	}
	return NewResponse[pb.EmptyArgs](nil), nil
}
