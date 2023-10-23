package util

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/smtp"
	"time"
	. "turbotin/models"
)

const EMAIL_TIME_LIMIT = time.Duration(0) * time.Minute

func SendEmail(user User, subject, msg string) error {
	to := user.Email

	if !IsAfter(user.LastEmailTime.Time, EMAIL_TIME_LIMIT) {
		return errors.New(fmt.Sprintf("Can only send emails once every %.0f min", EMAIL_TIME_LIMIT.Minutes()))
	}

	from := EMAIL
	password := EMAIL_PASSWORD
	if !IS_PRODUCTION && to != DEBUG_EMAIL {
		return errors.New("Can't send emails in dev")
	}
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	message := []byte(fmt.Sprintf("To: %s\nSubject : %s\n\n%s", to, subject, msg))
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		log.Fatal(err)
	}
	user.LastEmailTime = sql.NullTime{Time: time.Now(), Valid: true}
	DB.Save(user)
	return nil
}
