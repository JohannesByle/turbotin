package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	ent.Schema
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("email").MaxLen(100).NotEmpty().Unique(),
		field.String("password").MaxLen(100).NotEmpty(),
		field.Bool("email_verified"),
		field.String("email_code").MaxLen(64).MinLen(64).NotEmpty(),
		field.Time("email_code_created").Optional(),
		field.String("password_reset_code").MaxLen(64).MinLen(64).Optional(),
		field.Time("password_reset_code_created").Optional(),
		field.Bool("is_admin").Optional().Default(false),
		field.Time("last_email_time").Optional(),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("notifications", Notification.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
