package util

import (
	"os"

	"github.com/joho/godotenv"
)

var DEBUG_EMAIL, EMAIL, EMAIL_PASSWORD, SCHEME, HOST, DB_STR, CERT_FILE, KEY_FILE string
var IS_PRODUCTION bool

const ENV_FILE = ".env"

func InitEnv() {
	_, err := os.Stat(ENV_FILE)
	if err == nil {
		godotenv.Load(ENV_FILE)
	}
	DEBUG_EMAIL = os.Getenv("DEBUG_EMAIL")
	EMAIL = os.Getenv("EMAIL")
	EMAIL_PASSWORD = os.Getenv("EMAIL_PASSWORD")
	SCHEME = os.Getenv("SCHEME")
	HOST = os.Getenv("HOST")
	IS_PRODUCTION = os.Getenv("MODE") == "PRODUCTION"
	DB_STR = os.Getenv("DB_STR")
	CERT_FILE = os.Getenv("CERT_FILE")
	KEY_FILE = os.Getenv("KEY_FILE")
}
