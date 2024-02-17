package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"

	_ "github.com/go-sql-driver/mysql"
)

type TagToTag struct {
	ent.Schema
}

func (TagToTag) Fields() []ent.Field {
	return []ent.Field{}
}

func (TagToTag) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tag", Tag.Type).
			Ref("tag_links").
			Unique().
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.From("parent_tag", Tag.Type).
			Ref("parent_tag_links").
			Unique().
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
