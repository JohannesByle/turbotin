package services

import (
	"fmt"
	"time"
	"turbotin/ent"
	"turbotin/ent/user"
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
	user, _, err := GetUser[pb.User](ctx)
	if err != nil {
		return NewResponse[pb.User](nil), nil
	}
	res := NewResponse(&pb.User{})
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

	user, err := DB.User.Query().Where(user.EmailEQ(in.Email)).First(ctx)
	if !ent.IsNotFound(err) {
		if err == nil {
			return FlashError[pb.EmptyResponse]("An acount with that email already exists", CodeAlreadyExists)
		} else {
			return InternalError[pb.EmptyResponse](err)
		}
	}
	err = WithTx(ctx, DB, func(tx *ent.Tx) error {
		user, err = tx.User.Create().
			SetEmail(in.Email).
			SetPassword(GeneratePasswordHash(in.Password)).
			SetEmailVerified(false).
			SetEmailCode(GenSalt(64)).
			Save(ctx)
		if err != nil {
			return err
		}
		if err = SetEmail(resp, user.Email, in.Remember); err != nil {
			return err
		}
		subject := "Verify your email for your TurboTin.com account"
		url := fmt.Sprintf("https://www.turbotin.com/verify_email/%d/%s", user.ID, user.EmailCode)
		body := fmt.Sprintf("Please verify your email address using this link: %s", url)
		return SendEmail(ctx, tx, user, subject, body)
	})
	if err != nil {
		return FlashError[pb.EmptyResponse](err.Error(), CodeInternal)
	}
	Flash("Sign up successful", pb.Severity_SEVERITY_SUCCESS, resp)
	return resp, nil
}

func (s *Auth) Login(ctx context.Context, req *Request[pb.AuthArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	resp := NewResponse(&pb.EmptyResponse{})

	user, err := DB.User.Query().Where(user.EmailEQ(in.Email)).First(ctx)
	if err != nil || user.Email != in.Email || !CheckPasswordHash(in.Password, user.Password) {
		return FlashError[pb.EmptyResponse]("Email/password is incorrect", CodePermissionDenied)
	}
	SetEmail(resp, user.Email, in.Remember)
	Flash("Logged in", pb.Severity_SEVERITY_SUCCESS, resp)
	return resp, nil
}

func (s *Auth) VerifyEmail(ctx context.Context, req *Request[pb.VerifyEmailArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	user, err := DB.User.Query().Where(user.IDEQ(int(in.UserId))).First(ctx)
	if err != nil || int32(user.ID) != in.UserId || user.EmailCode != in.Code || user.EmailVerified {
		return FlashError[pb.EmptyResponse]("Unable to verify email", CodePermissionDenied)
	}
	user.EmailVerified = true
	_, err = DB.User.UpdateOneID(user.ID).SetEmailVerified(true).Save(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return FlashSuccess("Email verified", pb.EmptyResponse{})
}

func (s *Auth) DeleteUser(ctx context.Context, req *Request[pb.EmptyArgs]) (*Response[pb.EmptyResponse], error) {
	user_, resp, err := GetUser[pb.EmptyResponse](ctx)
	if err != nil {
		return resp, err
	}
	_, err = DB.User.Delete().Where(user.IDEQ(user_.ID)).Exec(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return FlashSuccess("Account deleted", pb.EmptyResponse{})
}

func (s *Auth) SendPasswordResetCode(ctx context.Context, req *Request[pb.SendResetPasswordArgs]) (*Response[pb.EmptyResponse], error) {
	const successMsg = "If the user exists a password reset code will be sent"
	email := req.Msg.Email
	user, err := DB.User.Query().Where(user.EmailEQ(email)).First(ctx)
	if err != nil {
		return FlashSuccess(successMsg, pb.EmptyResponse{})
	}
	err = WithTx(ctx, DB, func(tx *ent.Tx) error {
		user, err := tx.User.UpdateOneID(user.ID).
			SetPasswordResetCode(GenSalt(64)).
			SetPasswordResetCodeCreated(time.Now()).
			Save(ctx)
		if err != nil {
			return err
		}
		subject := "Your password reset link for TurboTin.com"
		url := fmt.Sprintf("%s://%s/change_password/%d/%s", SCHEME, HOST, user.ID, user.PasswordResetCode)
		body := fmt.Sprintf("Reset your password here: %s", url)
		return SendEmail(ctx, tx, user, subject, body)

	})
	if err != nil {
		return FlashError[pb.EmptyResponse](err.Error(), CodeInternal)
	}
	return FlashSuccess(successMsg, pb.EmptyResponse{})
}

func (s *Auth) ResetPassword(ctx context.Context, req *Request[pb.ResetPasswordArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	if len(in.Password) < MIN_PASSWORD_LEN {
		return FlashError[pb.EmptyResponse]("Password is too short", CodeInvalidArgument)
	}

	user, err := DB.User.Query().Where(user.IDEQ(int(in.UserId))).First(ctx)
	if err != nil || int32(user.ID) != in.UserId || user.PasswordResetCode != in.Code {
		return InternalError[pb.EmptyResponse](err)
	}
	if IsAfter(user.PasswordResetCodeCreated, PASSWORD_RESET_TIMEOUT) {
		return FlashError[pb.EmptyResponse]("Reset code expired", CodePermissionDenied)
	}

	user.Password = GeneratePasswordHash(in.Password)
	user.PasswordResetCode = GenSalt(64)
	_, err = DB.User.UpdateOneID(user.ID).
		SetPassword(GeneratePasswordHash(in.Password)).
		SetPasswordResetCode(GenSalt(64)).
		Save(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return FlashSuccess("Password reset", pb.EmptyResponse{})
}

func (s *Auth) GetEmail(ctx context.Context, req *Request[pb.ResetPasswordArgs]) (*Response[pb.Email], error) {
	in := req.Msg
	user, err := DB.User.Query().Where(user.IDEQ(int(in.UserId))).First(ctx)
	if err != nil {
		return InternalError[pb.Email](err)
	}
	return NewResponse(&pb.Email{Email: user.Email}), nil
}

func (s *Auth) ChangePassword(ctx context.Context, req *Request[pb.ChangePasswordArgs]) (*Response[pb.EmptyResponse], error) {
	in := req.Msg
	if len(in.NewPassword) < MIN_PASSWORD_LEN {
		return FlashError[pb.EmptyResponse]("Password is too short", CodeInvalidArgument)
	}
	user, err := DB.User.Query().Where(user.EmailEQ(in.Email)).First(ctx)
	ok := CheckPasswordHash(in.OldPassword, user.Password)
	if err != nil || user.Email != in.Email || !ok {
		return FlashError[pb.EmptyResponse]("Password is incorrect", CodePermissionDenied)
	}

	_, err = DB.User.UpdateOneID(user.ID).SetPassword(GeneratePasswordHash(in.NewPassword)).Save(ctx)
	if err != nil {
		return InternalError[pb.EmptyResponse](err)
	}
	return FlashSuccess("Password changed", pb.EmptyResponse{})
}
