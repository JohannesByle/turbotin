package services

import (
	"context"

	"turbotin/models"
	pb "turbotin/protos"
	. "turbotin/util"

	. "connectrpc.com/connect"
)

type Admin struct{}

func (s *Admin) GetTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagList], error) {
	tags := []*models.Tag{}
	DB.Find(&tags)
	resp := &pb.TagList{Items: []*pb.Tag{}}
	for _, tag := range tags {
		resp.Items = append(resp.Items, &pb.Tag{
			Id:         int32(tag.ID),
			ParentId:   int32(tag.ParentId),
			Value:      tag.Value,
			CategoryId: int32(tag.CategoryId),
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	return nil, nil
}

func (s *Admin) GetCategories(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.CategoryList], error) {
	cats := []*models.Category{}
	DB.Find(&cats)
	resp := &pb.CategoryList{Items: []*pb.Category{}}
	for _, cat := range cats {
		resp.Items = append(resp.Items, &pb.Category{
			Id:       int32(cat.ID),
			ParentId: int32(cat.ParentId),
			Name:     cat.Name,
		})
	}
	return NewResponse(resp), nil
}

func (s *Admin) SetCategories(ctx context.Context, req *Request[pb.CategoryList]) (*Response[pb.EmptyArgs], error) {
	return nil, nil
}
