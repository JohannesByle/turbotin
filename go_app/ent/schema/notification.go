package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"

	_ "github.com/go-sql-driver/mysql"
)

type Notification struct {
	ent.Schema
}

func (Notification) Fields() []ent.Field {
	return []ent.Field{
		field.Int16("max_price").Optional(),
		field.String("stores").MaxLen(250).Optional(),
		field.Bool("exclude_stores"),
	}
}

func (Notification) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("user", "tag").Unique(),
	}
}

func (Notification) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Unique().
			Ref("notifications"),
		edge.From("tag", Tag.Type).
			Unique().
			Ref("notifications"),
	}
}
