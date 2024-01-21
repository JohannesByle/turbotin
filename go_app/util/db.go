package util

import (
	"context"
	"fmt"
	"log"
	"turbotin/ent"
	"turbotin/ent/migrate"
)

var DB *ent.Client

func InitEnt() {
	var err error
	DB, err = ent.Open("mysql", DB_STR)

	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	ctx := context.Background()
	err = DB.Schema.Create(ctx,
		migrate.WithDropIndex(true),
		migrate.WithDropColumn(true))
	if err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}
	log.Println("ent intitialized")
}

func WithTx(ctx context.Context, client *ent.Client, fn func(tx *ent.Tx) error) error {
	tx, err := client.Tx(ctx)
	if err != nil {
		return err
	}
	defer func() {
		if v := recover(); v != nil {
			tx.Rollback()
			panic(v)
		}
	}()
	if err := fn(tx); err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("%w: rolling back transaction: %v", err, rerr)
		}
		return err
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("committing transaction: %w", err)
	}
	return nil
}
