package services

import (
	"regexp"
	"strconv"
	"strings"
	"time"
	"turbotin/models"
	pb "turbotin/protos"
	. "turbotin/util"

	. "turbotin/gen/turbotin/table"

	. "connectrpc.com/connect"
	. "github.com/go-jet/jet/v2/mysql"
	"google.golang.org/protobuf/types/known/timestamppb"

	"golang.org/x/net/context"
)

type Public struct{}

var NUMBER_REGEX = regexp.MustCompile(`(\d+.\d+)`)

func inStock(str string) bool {
	return strings.HasPrefix(strings.ToLower(str), "in stock")
}

func (s *Public) TodaysTobaccos(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.ObsTobaccoList], error) {
	var prices = TobaccoPrices

	type Row struct {
		TobaccoID int
		Price     string
		Stock     string
		Time      time.Time
		Store     int32
		Item      string
		Link      string
	}

	isLatestDay := func(t *TobaccoPricesTable) BoolExpression {
		return t.Time.GT(TimestampExp(SelectStatement(SELECT(DateExp(MAX(t.Time)).ADD(INTERVAL(-1, DAY))).FROM(t))))
	}

	t1 := prices.AS("t1")
	t2 := SELECT(
		prices.TobaccoID.AS(prices.TobaccoID.Name()),
		MAX(prices.Time).AS(prices.Time.Name())).
		FROM(prices).
		WHERE(isLatestDay(prices)).
		GROUP_BY(prices.TobaccoID).AsTable("t2")

	stmt, _ := SELECT(
		t1.TobaccoID.AS(t1.TobaccoID.Name()),
		MAX(t1.Price).AS(t1.Price.Name()),
		MAX(t1.Stock).AS(t1.Stock.Name()),
		MAX(t1.Time).AS(t1.Time.Name()),
		MAX(Tobaccos.Item).AS(Tobaccos.Item.Name()),
		MAX(Tobaccos.Link).AS(Tobaccos.Link.Name()),
		MAX(Tobaccos.Store).AS(Tobaccos.Store.Name())).
		FROM(t1.
			INNER_JOIN(t2,
				t1.TobaccoID.EQ(IntegerColumn(t1.TobaccoID.Name()).From(t2)).
					AND(t1.Time.EQ(DateTimeColumn(t1.Time.Name()).From(t2)))).
			LEFT_JOIN(Tobaccos, Tobaccos.ID.EQ(t1.TobaccoID))).
		WHERE(isLatestDay(t1)).
		GROUP_BY(t1.TobaccoID).Sql()

	rows, err := DB.Raw(stmt).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []*pb.ObsTobacco{}
	for rows.Next() {
		row := Row{}
		DB.ScanRows(rows, &row)

		items = append(items, &pb.ObsTobacco{
			TobaccoId: uint32(row.TobaccoID),
			Item:      row.Item,
			Store:     pb.Store(row.Store),
			Link:      row.Link,
			PriceStr:  row.Price,
			Time:      timestamppb.New(row.Time),
			InStock:   inStock(row.Stock),
		})
	}

	return NewResponse(&pb.ObsTobaccoList{Items: items}), nil
}

func (s *Public) GetTobaccoToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TobaccoToTagList], error) {
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

func (s *Public) GetTagToTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagToTagList], error) {
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

func (s *Public) GetTobaccos(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TobaccoList], error) {
	rows := []*models.Tobacco{}
	DB.Find(&rows)
	resp := &pb.TobaccoList{Items: []*pb.Tobacco{}}
	for _, row := range rows {
		resp.Items = append(resp.Items, &pb.Tobacco{
			Id:    uint32(row.ID),
			Item:  row.Item,
			Store: pb.Store(row.Store),
			Link:  row.Link,
		})
	}
	return NewResponse(resp), nil
}

func (s *Public) GetTags(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.TagList], error) {
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

func (s *Public) GetCategories(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.CategoryList], error) {
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

func (s *Public) GetAllTagData(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.AllTagData], error) {
	links, err := s.GetTobaccoToTags(ctx, req)
	if err != nil {
		return nil, err
	}
	tagLinks, err := s.GetTagToTags(ctx, req)
	if err != nil {
		return nil, err
	}
	tags, err := s.GetTags(ctx, req)
	if err != nil {
		return nil, err
	}
	cats, err := s.GetCategories(ctx, req)
	if err != nil {
		return nil, err
	}
	resp := &pb.AllTagData{
		Links:    links.Msg.Items,
		TagLinks: tagLinks.Msg.Items,
		Tags:     tags.Msg.Items,
		Cats:     cats.Msg.Items}
	return NewResponse(resp), nil
}

func (s *Public) GetTobaccoPrices(ctx context.Context, req *Request[pb.IntegerList]) (*Response[pb.TobaccoPrices], error) {

	allPrices := []*models.TobaccoPrice{}

	DB.Where("tobacco_id in ?", req.Msg.Items).Find(&allPrices)
	if DB.Error != nil {
		return InternalError[pb.TobaccoPrices]()
	}
	prices := make([]*pb.TobaccoPriceList, len(req.Msg.Items))
	for i := range req.Msg.Items {
		prices[i] = &pb.TobaccoPriceList{Items: []*pb.TobaccoPrice{}}
	}
	for _, row := range allPrices {
		for i, id := range req.Msg.Items {
			if id == uint32(row.TobaccoId) {
				price, err := strconv.ParseFloat(NUMBER_REGEX.FindString(row.Price), 64)
				if err != nil {
					continue
				}
				prices[i].Items = append(prices[i].Items, &pb.TobaccoPrice{
					Price:   price,
					Time:    timestamppb.New(row.Time),
					InStock: inStock(row.Stock)})
			}
		}
	}
	return NewResponse(&pb.TobaccoPrices{Items: prices}), nil
}
