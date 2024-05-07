package services

import (
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"
	"turbotin/ent"
	"turbotin/ent/tobacco"
	"turbotin/ent/tobaccoprice"

	pb "turbotin/protos"

	. "turbotin/util"

	. "connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/timestamppb"

	"golang.org/x/net/context"
)

type Public struct{}

var NUMBER_REGEX = regexp.MustCompile(`(\d+.\d+)`)

func inStock(str string) bool {
	return strings.HasPrefix(strings.ToLower(str), "in stock")
}

func (s *Public) TodaysTobaccos(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.ObsTobaccoList], error) {
	var v []struct {
		Max time.Time
	}
	err := DB.TobaccoPrice.
		Query().
		Aggregate(ent.Max(tobaccoprice.FieldTime)).
		Scan(ctx, &v)
	if err != nil {
		return InternalError[pb.ObsTobaccoList](err)
	}
	max := v[0].Max.Add(time.Duration(-2) * time.Hour)

	rows, err := DB.TobaccoPrice.Query().
		WithTobacco().
		Where(tobaccoprice.TimeGTE(max)).All(ctx)

	if err != nil {
		return InternalError[pb.ObsTobaccoList](err)
	}

	dups := map[int]bool{}
	resp := &pb.ObsTobaccoList{}
	for _, row := range rows {
		_, ok := dups[row.Edges.Tobacco.ID]
		if ok {
			continue
		}
		dups[row.Edges.Tobacco.ID] = true
		t := row.Edges.Tobacco
		resp.Items = append(resp.Items, &pb.ObsTobacco{
			Item:      t.Item,
			Store:     pb.Store(t.Store),
			Link:      t.Link,
			PriceStr:  row.Price,
			Time:      timestamppb.New(row.Time),
			InStock:   inStock(row.Stock),
			TobaccoId: int32(t.ID),
		})
	}
	return NewResponse(resp), err
}

func (s *Public) GetTobaccoToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TobaccoToTagList], error) {
	tags, err := DB.TobaccoToTag.Query().WithTag().WithTobacco().All(ctx)
	if err != nil {
		return InternalError[pb.TobaccoToTagList](err)
	}
	resp := &pb.TobaccoToTagList{Items: []*pb.TobaccoToTag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.TobaccoToTag{
			Id:        int32(tag.ID),
			TagId:     int32(tag.Edges.Tag.ID),
			TobaccoId: int32(tag.Edges.Tobacco.ID),
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetTagToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagToTagList], error) {
	tags, err := DB.TagToTag.Query().WithParentTag().WithTag().All(ctx)
	if err != nil {
		return InternalError[pb.TagToTagList](err)
	}
	resp := &pb.TagToTagList{Items: []*pb.TagToTag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.TagToTag{
			Id:          int32(tag.ID),
			TagId:       int32(tag.Edges.Tag.ID),
			ParentTagId: int32(tag.Edges.ParentTag.ID),
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetTobaccos(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TobaccoList], error) {
	rows, err := DB.Tobacco.Query().All(ctx)
	if err != nil {
		return InternalError[pb.TobaccoList](err)
	}
	resp := &pb.TobaccoList{Items: []*pb.Tobacco{}}
	for _, row := range rows {
		resp.Items = append(resp.Items, &pb.Tobacco{
			Id:    int32(row.ID),
			Item:  row.Item,
			Store: pb.Store(row.Store),
			Link:  row.Link,
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagList], error) {
	tags, err := DB.Tag.Query().WithCategory().All(ctx)
	if err != nil {
		return InternalError[pb.TagList](err)
	}
	resp := &pb.TagList{Items: []*pb.Tag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.Tag{
			Id:         int32(tag.ID),
			Value:      tag.Value,
			CategoryId: int32(tag.Edges.Category.ID),
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetCategories(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.CategoryList], error) {
	cats, err := DB.Category.Query().All(ctx)
	if err != nil {
		return InternalError[pb.CategoryList](err)
	}
	resp := &pb.CategoryList{Items: []*pb.Category{}}
	for _, cat := range cats {
		resp.Items = append(resp.Items, &pb.Category{
			Id:   int32(cat.ID),
			Name: cat.Name,
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetAllTagData(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.AllTagData], error) {
	links, err := s.GetTobaccoToTags(ctx, req)
	if err != nil {
		return InternalError[pb.AllTagData](err)
	}
	tagLinks, err := s.GetTagToTags(ctx, req)
	if err != nil {
		return InternalError[pb.AllTagData](err)
	}
	tags, err := s.GetTags(ctx, req)
	if err != nil {
		return InternalError[pb.AllTagData](err)
	}
	cats, err := s.GetCategories(ctx, req)
	if err != nil {
		return InternalError[pb.AllTagData](err)
	}
	resp := &pb.AllTagData{
		Links:    links.Msg.Items,
		TagLinks: tagLinks.Msg.Items,
		Tags:     tags.Msg.Items,
		Cats:     cats.Msg.Items}
	return NewResponse(resp), nil
}

func (s *Public) GetTobaccoPrices(ctx context.Context, req *Request[pb.IntegerList]) (*Response[pb.TobaccoPrices], error) {
	ids := []int{}
	for _, id := range req.Msg.Items {
		ids = append(ids, int(id))
	}
	tobaccos, err := DB.Tobacco.Query().Where(tobacco.IDIn(ids...)).WithPrices().All(ctx)
	if err != nil {
		return InternalError[pb.TobaccoPrices](err)
	}
	prices := make([]*pb.TobaccoPriceList, len(req.Msg.Items))
	for i := range req.Msg.Items {
		prices[i] = &pb.TobaccoPriceList{Items: []*pb.TobaccoPrice{}}
		j := slices.IndexFunc(tobaccos, func(t *ent.Tobacco) bool {
			return t.ID == int(req.Msg.Items[i])
		})
		if j < 0 {
			continue
		}
		for _, price := range tobaccos[j].Edges.Prices {
			num, err := strconv.ParseFloat(NUMBER_REGEX.FindString(price.Price), 64)
			if err != nil {
				continue
			}
			prices[i].Items = append(prices[i].Items, &pb.TobaccoPrice{
				Price:   num,
				Time:    timestamppb.New(price.Time),
				InStock: inStock(price.Stock)})
		}

	}
	return NewResponse(&pb.TobaccoPrices{Items: prices}), nil
}
