package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"

	_ "github.com/go-sql-driver/mysql"
)

type TobaccoToTag struct {
	ent.Schema
}

func (TobaccoToTag) Fields() []ent.Field {
	return []ent.Field{}
}

func (TobaccoToTag) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tobacco", Tobacco.Type).
			Ref("tags").
			Unique().
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.From("tag", Tag.Type).
			Ref("tobacco_links").
			Unique().
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
