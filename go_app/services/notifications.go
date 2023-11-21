package services

import (
	"database/sql"
	"turbotin/models"
	pb "turbotin/protos"
	"turbotin/util"
	. "turbotin/util"

	. "connectrpc.com/connect"
	"gorm.io/gorm"

	"golang.org/x/net/context"
)

type Notifications struct{}

func (s *Notifications) GetNotifications(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.NotificationList], error) {
	user, r, err := util.GetUser[pb.NotificationList](ctx)
	if err != nil {
		return r, err
	}
	notifications := []*models.Notification{}
	DB.Where("user_id = ?", user.ID).Find(&notifications)
	resp := &pb.NotificationList{Items: []*pb.Notification{}}
	for _, notification := range notifications {
		resp.Items = append(resp.Items, &pb.Notification{
			Id:            uint32(notification.ID),
			TagId:         uint32(notification.TagId),
			MaxPrice:      uint32(notification.MaxPrice.Int16),
			Stores:        notification.Stores,
			ExcludeStores: notification.ExcludeStores,
		})
	}
	return NewResponse(resp), nil
}

func (s *Notifications) SetNotifications(ctx context.Context, req *Request[pb.NotificationList]) (*Response[pb.EmptyResponse], error) {
	user, r, err := util.GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return r, err
	}
	notifications := []*models.Notification{}
	for _, notification := range req.Msg.Items {
		notifications = append(notifications, &models.Notification{
			UserId:        uint(user.ID),
			TagId:         uint(notification.TagId),
			MaxPrice:      sql.NullInt16{Valid: notification.MaxPrice > 0, Int16: int16(notification.MaxPrice)},
			Stores:        notification.Stores,
			ExcludeStores: notification.ExcludeStores,
			Model:         gorm.Model{ID: uint(notification.Id)},
		})
	}

	DB.Save(&notifications)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return NewResponse[pb.EmptyResponse](nil), nil
}

func (s *Notifications) DeleteNotifications(ctx context.Context, req *Request[pb.IntegerList]) (*Response[pb.EmptyResponse], error) {
	user, r, err := util.GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return r, err
	}
	DB.Unscoped().Where("user_id = ? AND id IN ?", user.ID, req.Msg.Items).Delete(&models.Notification{})
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return NewResponse[pb.EmptyResponse](nil), nil
}
