package services

import (
	"context"

	"turbotin/models"
	pb "turbotin/protos"
	. "turbotin/util"

	. "connectrpc.com/connect"
	"gorm.io/gorm"
)

type Admin struct{}

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
		return nil
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
	DB.Transaction(func(tx *gorm.DB) error {
		links := []*models.TagToTag{}
		for _, link := range req.Msg.Items {
			links = append(links, &models.TagToTag{
				TagId:       uint(link.TagId),
				ParentTagId: uint(link.ParentTagId),
				Model:       gorm.Model{ID: uint(link.Id)},
			})
		}
		return tx.Save(links).Error
	})
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
	return nil, nil
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
	return nil, nil
}
