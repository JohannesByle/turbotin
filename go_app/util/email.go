package util

import (
	"context"
	"errors"
	"fmt"
	"net/smtp"
	"time"
	"turbotin/ent"
	. "turbotin/ent"
)

const EMAIL_TIME_LIMIT = time.Duration(10) * time.Minute

func SendEmail(ctx context.Context, tx *ent.Tx, user *User, subject, msg string) error {
	to := user.Email
	if !IsAfter(user.LastEmailTime, EMAIL_TIME_LIMIT) {
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
		return err
	}
	_, err = tx.User.UpdateOneID(user.ID).SetLastEmailTime(time.Now()).Save(ctx)
	return err

}
