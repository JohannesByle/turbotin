package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"

	_ "github.com/go-sql-driver/mysql"
)

type Tobacco struct {
	ent.Schema
}

func (Tobacco) Fields() []ent.Field {
	return []ent.Field{
		field.Int16("store"),
		field.String("item").NotEmpty().MaxLen(150),
		field.String("link").NotEmpty().MaxLen(250),
	}
}

func (Tobacco) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("item", "link").Unique(),
	}
}

func (Tobacco) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("prices", TobaccoPrice.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("tags", TobaccoToTag.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
