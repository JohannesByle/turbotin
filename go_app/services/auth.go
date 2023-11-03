package services

import (
	"database/sql"
	"fmt"
	"log"
	"time"
	"turbotin/models"
	pb "turbotin/protos"
	. "turbotin/util"

	. "connectrpc.com/connect"
	"golang.org/x/net/context"
)

const (
	MIN_PASSWORD_LEN       = 8
	PASSWORD_RESET_TIMEOUT = time.Duration(10) * time.Minute
)

type Auth struct{}

func (s *Auth) GetCurrentUser(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.User], error) {
	user, res, err := GetUser[pb.User](ctx)
	if err != nil {
		return NewResponse[pb.User](nil), nil
	}
	res = NewResponse(&pb.User{})
	res.Msg.Email = user.Email
	res.Msg.EmailVerified = user.EmailVerified
	res.Msg.IsAdmin = user.IsAdmin
	return res, nil
}

func (s *Auth) SignUp(ctx context.Context, req *Request[pb.AuthArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	resp := NewResponse(&pb.EmptyResponse{})

	if !EMAIL_REGEX.Match([]byte(in.Email)) {
		return FlashError[pb.EmptyResponse]("Invalid email", CodeInvalidArgument)
	}
	if len(in.Password) < MIN_PASSWORD_LEN {
		return FlashError[pb.EmptyResponse]("Password is too short", CodeInvalidArgument)
	}

	var user models.User
	DB.Where(&models.User{Email: in.Email}).First(&user)

	if user.Email == in.Email {
		return FlashError[pb.EmptyResponse]("An acount with that email already exists", CodeAlreadyExists)
	}

	user = models.User{
		Email:         in.Email,
		Password:      GeneratePasswordHash(in.Password),
		EmailVerified: false,
		EmailCode:     GenSalt(16),
	}
	log.Println(user.EmailCode)
	err := DB.Save(&user).Error
	if err != nil {
		return InternalError[pb.EmptyResponse]()
	}
	err = SetEmail(resp, user.Email, in.Remember)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	subject := "Verify your email for your TurboTin.com account"
	url := fmt.Sprintf("%s://%s/verify_email/%d/%s", SCHEME, HOST, user.ID, user.EmailCode)
	body := fmt.Sprintf("Please verify your email address using this link: %s", url)
	err = SendEmail(user, subject, body)
	if err != nil {
		return InternalError[pb.EmptyResponse]()
	}
	Flash("Sign up successful", pb.Severity_SEVERITY_SUCCESS, resp)
	return resp, nil
}

func (s *Auth) Login(ctx context.Context, req *Request[pb.AuthArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	resp := NewResponse(&pb.EmptyResponse{})

	var user models.User
	DB.Where(&models.User{Email: in.Email}).First(&user)
	ok := CheckPasswordHash(in.Password, user.Password)
	if user.Email != in.Email || !ok {
		return FlashError[pb.EmptyResponse]("Email/password is incorrect", CodePermissionDenied)
	}
	SetEmail(resp, user.Email, in.Remember)
	Flash("Logged in", pb.Severity_SEVERITY_SUCCESS, resp)
	return resp, nil
}

func (s *Auth) VerifyEmail(ctx context.Context, req *Request[pb.VerifyEmailArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg

	var user models.User
	DB.First(&user, in.UserId)
	if uint32(user.ID) != in.UserId || user.EmailCode != in.Code || user.EmailVerified {
		return FlashError[pb.EmptyResponse]("Unable to verify email", CodePermissionDenied)
	}
	user.EmailVerified = true
	DB.Save(user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return FlashSuccess("Email verified", pb.EmptyResponse{})
}

func (s *Auth) DeleteUser(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.EmptyResponse], error) {
	user, resp, err := GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return resp, err
	}
	DB.Delete(&user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return FlashSuccess("Account deleted", pb.EmptyResponse{})
}

func (s *Auth) SendPasswordResetCode(ctx context.Context, req *Request[pb.SendResetPasswordArgs]) (*Response[pb.EmptyResponse], error) {
	email := req.Msg.Email
	var user models.User
	DB.Where(&models.User{Email: email}).First(&user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	user.PasswordResetCode = GenSalt(16)
	user.PasswordResetCreated = sql.NullTime{Time: time.Now(), Valid: true}
	DB.Save(user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	subject := "Your password reset link for TurboTin.com"
	url := fmt.Sprintf("%s://%s/change_password/%d/%s", SCHEME, HOST, user.ID, user.PasswordResetCode)
	body := fmt.Sprintf("Reset your password here: %s", url)
	err := SendEmail(user, subject, body)
	if err != nil {
		return nil, NewError(CodeInternal, err)
	}
	return FlashSuccess("Password reset code sent", pb.EmptyResponse{})
}

func (s *Auth) ResetPassword(ctx context.Context, req *Request[pb.ResetPasswordArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	if len(in.Password) < MIN_PASSWORD_LEN {
		return FlashError[pb.EmptyResponse]("Password is too short", CodeInvalidArgument)
	}

	var user models.User
	DB.First(&user, in.UserId)
	if IsAfter(user.PasswordResetCreated.Time, PASSWORD_RESET_TIMEOUT) {
		log.Println(user.PasswordResetCreated.Time)
		return FlashError[pb.EmptyResponse]("Reset code expired", CodePermissionDenied)
	}
	if uint32(user.ID) != in.UserId || user.PasswordResetCode != in.Code {
		return InternalError[pb.EmptyResponse]()
	}
	user.Password = GeneratePasswordHash(in.Password)
	user.PasswordResetCode = GenSalt(16)
	DB.Save(user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return FlashSuccess("Password reset", pb.EmptyResponse{})
}

func (s *Auth) GetEmail(ctx context.Context, req *Request[pb.ResetPasswordArgs]) (*Response[pb.Email], error) {
	in := req.Msg
	var user models.User
	DB.First(&user, in.UserId)
	if DB.Error != nil {
		return InternalError[pb.Email]()
	}
	return NewResponse(&pb.Email{Email: user.Email}), nil
}

func (s *Auth) ChangePassword(ctx context.Context, req *Request[pb.ChangePasswordArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	if len(in.NewPassword) < MIN_PASSWORD_LEN {
		return FlashError[pb.EmptyResponse]("Password is too short", CodeInvalidArgument)
	}
	var user models.User
	DB.Where(&models.User{Email: in.Email}).First(&user)
	ok := CheckPasswordHash(in.OldPassword, user.Password)
	if user.Email != in.Email || !ok {
		return FlashError[pb.EmptyResponse]("Password is incorrect", CodePermissionDenied)
	}
	user.Password = GeneratePasswordHash(in.NewPassword)
	DB.Save(user)
	if DB.Error != nil {
		return InternalError[pb.EmptyResponse]()
	}
	return NewResponse(&pb.EmptyResponse{}), nil
}
