package util

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"
	"turbotin/ent"
	_ "turbotin/ent"
	"turbotin/ent/user"

	. "turbotin/protos/protosconnect"

	. "connectrpc.com/connect"
	"github.com/golang-jwt/jwt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	METHOD      = "sha256"
	SALT_LENGTH = 16
	SALT_CHARS  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	EMAIL_KEY       = "email"
	AUTH_COOKIE_KEY = "jwt"
	SET_COOKIE      = "Set-Cookie"
	COOKIE          = "Cookie"
	COOKIE_NUM_DAYS = 7

	SECRET_KEY_DURATION = time.Duration(COOKIE_NUM_DAYS*24) * time.Hour
)

var SECRET_KEY = make([]byte, 512)
var SECRET_KEY_DATE = time.Now()
var HAS_INIT_KEY bool

var EMAIL_REGEX, _ = regexp.Compile("^[A-z0-9+_.-]+@[A-z0-9.-]+$")

func GetEmail(ctx context.Context) (string, bool) {
	email := ctx.Value(EMAIL_KEY)
	if email == nil {
		return "", false
	}
	return email.(string), true
}

func GetUser[T any](ctx context.Context) (ent.User, *Response[T], error) {
	email, ok := GetEmail(ctx)
	if !ok {
		resp, err := FlashError[T]("Not logged in", CodePermissionDenied)
		return ent.User{}, resp, err
	}
	user, err := DB.User.Query().Where(user.EmailEQ(email)).First(ctx)
	if err != nil {
		return ent.User{}, DeleteEmail[T](), NewError(CodeNotFound, errors.New("User not found"))
	}
	return *user, nil, nil
}

func SetEmail(resp AnyResponse, email string, remember bool) error {
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{"email": email})
	value, err := token.SignedString(SECRET_KEY)
	if err != nil {
		return err
	}
	cookie := http.Cookie{Name: AUTH_COOKIE_KEY, Value: value, Path: "/"}
	if remember {
		cookie.Expires = time.Now().AddDate(0, 0, COOKIE_NUM_DAYS)
	}
	resp.Header().Set(SET_COOKIE, cookie.String())
	return nil
}

func DeleteEmail[T any]() *Response[T] {
	cookie := http.Cookie{Name: AUTH_COOKIE_KEY, Expires: time.Now()}
	resp := NewResponse[T](nil)
	resp.Header().Set(SET_COOKIE, cookie.String())
	return resp
}

func initKey() {
	if HAS_INIT_KEY && !IsAfter(SECRET_KEY_DATE, SECRET_KEY_DURATION) {
		return
	}
	_, err := rand.Read(SECRET_KEY)
	SECRET_KEY_DATE = time.Now()
	if err != nil {
		log.Fatalf("failed to generate secret key: %v", err)
	}
	HAS_INIT_KEY = true

}

func parseCookies(cookies string) []http.Cookie {
	header := http.Header{}
	header.Add(COOKIE, cookies)
	request := http.Request{Header: header}
	var result []http.Cookie
	for _, ptr := range request.Cookies() {
		result = append(result, *ptr)
	}
	return result

}

func authenticateUser(req AnyRequest) (email string, authenticated bool) {
	var cookie http.Cookie
	for _, c := range parseCookies(req.Header().Get(COOKIE)) {
		if c.Name == AUTH_COOKIE_KEY {
			cookie = c
			break
		}
	}
	if len(cookie.Value) == 0 {
		return email, false
	}
	claims := jwt.MapClaims{}
	tok, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		if method, ok := token.Method.(*jwt.SigningMethodHMAC); !ok || method != jwt.SigningMethodHS512 {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return SECRET_KEY, nil
	})
	if err != nil || !tok.Valid {
		return email, false
	}
	return claims[EMAIL_KEY].(string), true
}

var WHITELIST = [7]string{
	AuthSignUpProcedure,
	AuthLoginProcedure,
	AuthGetCurrentUserProcedure,
	AuthVerifyEmailProcedure,
	AuthResetPasswordProcedure,
	AuthSendPasswordResetCodeProcedure,
	AuthGetEmailProcedure}

var AUTH_INTERCEPTOR = UnaryInterceptorFunc(func(next UnaryFunc) UnaryFunc {
	return UnaryFunc(func(ctx context.Context, req AnyRequest) (AnyResponse, error) {
		initKey()

		email, authenticated := authenticateUser(req)
		method := req.Spec().Procedure
		whitelisted := method[1:len(PublicName)+1] == PublicName
		for _, str := range WHITELIST {
			whitelisted = whitelisted || str == method
		}

		if authenticated && method[1:len(AdminName)+1] == AdminName {
			user := DB.User.Query().Where(user.EmailEQ(email)).FirstX(ctx)
			authenticated = user.IsAdmin
		}

		if authenticated {
			return next(context.WithValue(ctx, EMAIL_KEY, email), req)
		} else if !whitelisted {
			return nil, status.Errorf(codes.Unauthenticated, "Unauthenticated")
		} else {
			return next(ctx, req)
		}

	})
})

func GeneratePasswordHash(password string) string {
	salt := GenSalt(SALT_LENGTH)
	hash := hashString(salt, password)
	return fmt.Sprintf("%s$%s$%s", METHOD, salt, hash)
}

func CheckPasswordHash(password string, hash string) bool {
	if strings.Count(hash, "$") < 2 {
		return false
	}
	ps := strings.Split(hash, "$")
	return ps[2] == hashString(ps[1], password)
}

func GenSalt(length int) string {
	var bytes = make([]byte, length)
	rand.Read(bytes)
	for k, v := range bytes {
		bytes[k] = SALT_CHARS[v%byte(len(SALT_CHARS))]
	}
	return string(bytes)
}

func hashString(salt string, password string) string {
	mac := hmac.New(sha256.New, []byte(salt))
	mac.Write([]byte(password))
	return hex.EncodeToString(mac.Sum(nil))
}

func IsAfter(t time.Time, d time.Duration) bool {
	return time.Now().After(t.Add(d))
}
