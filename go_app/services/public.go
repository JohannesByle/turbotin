package services

import (
	"strings"
	"time"
	pb "turbotin/protos"
	"turbotin/util"

	. "turbotin/gen/turbotin/table"

	. "connectrpc.com/connect"
	. "github.com/go-jet/jet/v2/mysql"
	"google.golang.org/protobuf/types/known/timestamppb"

	"golang.org/x/net/context"
)

type Public struct{}

var prices = TobaccoPrices

func (s *Public) TodaysTobaccos(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.ObsTobaccoList], error) {

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

	rows, err := util.DB.Raw(stmt).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []*pb.ObsTobacco{}
	for rows.Next() {
		row := Row{}
		util.DB.ScanRows(rows, &row)

		items = append(items, &pb.ObsTobacco{
			TobaccoId: int32(row.TobaccoID),
			Item:      row.Item,
			Store:     pb.Store(row.Store),
			Link:      row.Link,
			PriceStr:  row.Price,
			Time:      timestamppb.New(row.Time),
			InStock:   strings.ToLower(row.Stock) == "in stock",
		})
	}

	return NewResponse(&pb.ObsTobaccoList{Items: items}), nil
}
