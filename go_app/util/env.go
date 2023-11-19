package util

import (
	"os"

	"github.com/joho/godotenv"
)

var DEBUG_EMAIL, EMAIL, EMAIL_PASSWORD, SCHEME, HOST, DB_STR string
var IS_PRODUCTION bool

func InitEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}
	DEBUG_EMAIL = os.Getenv("DEBUG_EMAIL")
	EMAIL = os.Getenv("EMAIL")
	EMAIL_PASSWORD = os.Getenv("EMAIL_PASSWORD")
	SCHEME = os.Getenv("SCHEME")
	HOST = os.Getenv("HOST")
	IS_PRODUCTION = os.Getenv("MODE") == "PRODUCTION"
	DB_STR = os.Getenv("DB_STR")
}
