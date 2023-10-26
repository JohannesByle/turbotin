package services

import (
	"context"

	pb "turbotin/protos"

	. "connectrpc.com/connect"
)

type Admin struct{}

func (s *Admin) GetTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagList], error) {
	return nil, nil
}

func (s *Admin) DeleteTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	return nil, nil
}

func (s *Admin) UpdateTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	return nil, nil
}

func (s *Admin) CreateTags(ctx context.Context, req *Request[pb.TagList]) (*Response[pb.EmptyArgs], error) {
	return nil, nil
}
