package util

import (
	"log"
	"os"
	"time"

	"turbotin/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitGorm() {
	var err error

	DB, err = gorm.Open(mysql.Open(DB_STR), &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  logger.Error,
				Colorful:                  true,
				IgnoreRecordNotFoundError: false,
				ParameterizedQueries:      true,
			},
		),
		PrepareStmt:            true,
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	DB.AutoMigrate(
		&models.User{},
		&models.Tobacco{},
		&models.TobaccoPrice{},
		&models.Tag{},
		&models.Category{},
		&models.TagToTag{},
		&models.TobaccoToTag{},
		&models.Notification{})
	log.Printf("gorm initialized")
}
