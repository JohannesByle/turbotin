package services

import (
	"turbotin/ent/notification"
	userSql "turbotin/ent/user"
	pb "turbotin/protos"
	"turbotin/util"
	. "turbotin/util"

	. "connectrpc.com/connect"

	"golang.org/x/net/context"
)

type Notifications struct{}

func (s *Notifications) GetNotifications(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.NotificationList], error) {
	user, r, err := GetUser[pb.NotificationList](ctx)
	if err != nil {
		return r, err
	}
	notifications, err := DB.Notification.
		Query().
		Where(notification.HasUserWith(userSql.IDEQ(user.ID))).
		WithTag().
		All(ctx)
	if err != nil {
		return InternalError[pb.NotificationList](err)
	}
	resp := &pb.NotificationList{Items: []*pb.Notification{}}
	for _, notification := range notifications {
		resp.Items = append(resp.Items, &pb.Notification{
			Id:            int32(notification.ID),
			TagId:         int32(notification.Edges.Tag.ID),
			MaxPrice:      int32(notification.MaxPrice),
			Stores:        notification.Stores,
			ExcludeStores: notification.ExcludeStores,
		})
	}
	return NewResponse(resp), nil
}

func (s *Notifications) UpdateNotification(ctx context.Context, req *Request[pb.Notification]) (*Response[pb.EmptyResponse], error) {
	user, r, err := util.GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return r, err
	}
	n := req.Msg
	_, err = DB.Notification.UpdateOneID(int(n.Id)).
		SetUserID(user.ID).
		SetTagID(int(n.TagId)).
		SetMaxPrice(int16(n.MaxPrice)).
		SetStores(n.Stores).
		SetExcludeStores(n.ExcludeStores).Save(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return NewResponse[pb.EmptyResponse](nil), nil
}

func (s *Notifications) CreateNotification(ctx context.Context, req *Request[pb.Notification]) (*Response[pb.EmptyResponse], error) {
	user, r, err := util.GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return r, err
	}
	n := req.Msg
	_, err = DB.Notification.Create().
		SetUserID(user.ID).
		SetTagID(int(n.TagId)).
		SetMaxPrice(int16(n.MaxPrice)).
		SetStores(n.Stores).
		SetExcludeStores(n.ExcludeStores).Save(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return NewResponse[pb.EmptyResponse](nil), nil
}

func (s *Notifications) DeleteNotifications(ctx context.Context, req *Request[pb.IntegerList]) (*Response[pb.EmptyResponse], error) {
	user, r, err := util.GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return r, err
	}
	ids := []int{}
	for _, id := range req.Msg.Items {
		ids = append(ids, int(id))
	}
	_, err = DB.Notification.Delete().
		Where(notification.HasUserWith(userSql.IDEQ(user.ID)), notification.IDIn(ids...)).
		Exec(ctx)
	return NewResponse[pb.EmptyResponse](nil), nil
}
