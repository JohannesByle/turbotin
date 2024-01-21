package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	_ "github.com/go-sql-driver/mysql"
)

type TobaccoPrice struct {
	ent.Schema
}

func (TobaccoPrice) Fields() []ent.Field {
	return []ent.Field{
		field.String("price").MaxLen(100),
		field.String("stock").MaxLen(100),
		field.Time("time"),
	}
}

func (TobaccoPrice) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tobacco", Tobacco.Type).Ref("prices").Unique(),
	}
}
