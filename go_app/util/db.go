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

const DB_STR = "gorm:vahiy@tcp(127.0.0.1:3306)/turbotin?charset=utf8mb4&parseTime=True&loc=Local"

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
	DB.AutoMigrate(&models.User{}, &models.Tobacco{}, &models.TobaccoPrice{})
	log.Printf("gorm initialized")
}
