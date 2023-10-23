package main

import (
	"errors"
	"net/http"
	"os"
	"path"
	"time"

	"turbotin/protos/protosconnect"
	"turbotin/services"
	"turbotin/util"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

const (
	green   = "\033[97;42m"
	white   = "\033[90;47m"
	yellow  = "\033[90;43m"
	red     = "\033[97;41m"
	blue    = "\033[97;44m"
	magenta = "\033[97;45m"
	cyan    = "\033[97;46m"
	reset   = "\033[0m"
)

const (
	STATIC_DIR = "../react_app/build"
)

func fileHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, req *http.Request) {
		_, err := os.Stat(path.Join(STATIC_DIR, req.URL.Path))
		args := util.LogArgs{Path: req.URL.Path}
		start := time.Now()
		if errors.Is(err, os.ErrNotExist) {
			http.ServeFile(writer, req, path.Join(STATIC_DIR, "/index.html"))
		} else {
			h.ServeHTTP(writer, req)
		}
		args.TimeStamp = time.Now()
		args.Latency = args.TimeStamp.Sub(start)
		util.LogRequest(args)

	})
}

func main() {
	util.InitEnv()
	util.InitGorm()

	opts := connect.WithInterceptors(util.LOG_INTERCEPTOR, util.AUTH_INTERCEPTOR)

	mux := http.NewServeMux()

	mux.Handle(protosconnect.NewAuthHandler(&services.Auth{}, opts))
	mux.Handle(protosconnect.NewPublicHandler(&services.Public{}, opts))
	mux.Handle("/", fileHandler(http.FileServer(http.Dir(STATIC_DIR))))

	http.ListenAndServe(util.HOST, h2c.NewHandler(mux, &http2.Server{}))

}
