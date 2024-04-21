package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	_ "github.com/go-sql-driver/mysql"
)

type Tag struct {
	ent.Schema
}

func (Tag) Fields() []ent.Field {
	return []ent.Field{
		field.String("value").MaxLen(500),
	}
}

func (Tag) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("tobacco_links", TobaccoToTag.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("tag_links", TagToTag.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("parent_tag_links", TagToTag.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("notifications", Notification.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.From("category", Category.Type).Ref("tags").Unique(),
	}
}
