package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	_ "github.com/go-sql-driver/mysql"
)

type Category struct {
	ent.Schema
}

func (Category) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Unique(),
	}
}

func (Category) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("tags", Tag.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
