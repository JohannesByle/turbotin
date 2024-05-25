package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"turbotin/protos/protosconnect"
	"turbotin/services"
	"turbotin/util"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

var (
	STATIC_DIR = path.Clean("./build")
	INDEX_FILE = path.Clean(path.Join(STATIC_DIR, "/index.html"))
)

func fileHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, req *http.Request) {
		filePath := path.Clean(path.Join(STATIC_DIR, req.URL.Path))
		info, err := os.Stat(filePath)
		args := util.LogArgs{Path: req.URL.Path}
		start := time.Now()

		if errors.Is(err, os.ErrNotExist) || !strings.HasPrefix(filePath, STATIC_DIR) || info.IsDir() {
			writer.Header().Set("Cache-Control", "no-cache")
			http.ServeFile(writer, req, INDEX_FILE)
		} else {
			writer.Header().Set("Cache-Control", "max-age=31536000")
			allowBr := strings.Contains(req.Header.Get("Accept-Encoding"), "br")
			brFile := filePath + ".br"
			_, err := os.Stat(brFile)
			if allowBr && err == nil {
				writer.Header().Set("Content-Encoding", "br")
				http.ServeFile(writer, req, brFile)
			} else {
				h.ServeHTTP(writer, req)
			}

		}

		args.TimeStamp = time.Now()
		args.Latency = args.TimeStamp.Sub(start)
		util.LogRequest(args)

	})
}

func main() {
	util.InitEnv()
	util.InitEnt()

	opts := connect.WithInterceptors(util.LOG_INTERCEPTOR, util.AUTH_INTERCEPTOR)

	mux := http.NewServeMux()

	mux.Handle(protosconnect.NewAuthHandler(&services.Auth{}, opts))
	mux.Handle(protosconnect.NewPublicHandler(&services.Public{}, opts))
	mux.Handle(protosconnect.NewAdminHandler(&services.Admin{}, opts))
	mux.Handle(protosconnect.NewNotificationsHandler(&services.Notifications{}, opts))
	mux.Handle("/", fileHandler(http.FileServer(http.Dir(STATIC_DIR))))

	log.Printf("listening on: %s", util.HOST)
	var err error
	if util.HOST == ":443" {
		err = http.ListenAndServeTLS(util.HOST, util.CERT_FILE, util.KEY_FILE, h2c.NewHandler(mux, &http2.Server{}))
	} else {
		err = http.ListenAndServe(util.HOST, h2c.NewHandler(mux, &http2.Server{}))
	}
	if err != nil {
		log.Fatal(err)
	}
}
