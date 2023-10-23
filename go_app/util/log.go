package util

import (
	"context"
	"fmt"
	"time"

	. "connectrpc.com/connect"
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

type LogArgs struct {
	TimeStamp time.Time
	Latency   time.Duration
	Path      string
	Err       error
}

func LogRequest(args LogArgs) {

	var color string
	var status int
	if args.Err != nil {
		color = red
		status = int(CodeOf(args.Err))
	} else {
		color = green
		status = 500
	}

	fmt.Printf("%v |%s %03d %s| %15s | %#v\n",
		args.TimeStamp.Format("2006/01/02 - 15:04:05"),
		color, status, reset,
		args.Latency,
		args.Path)
}

var LOG_INTERCEPTOR = UnaryInterceptorFunc(func(next UnaryFunc) UnaryFunc {
	return UnaryFunc(func(ctx context.Context, req AnyRequest) (AnyResponse, error) {
		args := LogArgs{Path: req.Spec().Procedure}
		start := time.Now()
		resp, err := next(ctx, req)
		args.TimeStamp = time.Now()
		args.Latency = args.TimeStamp.Sub(start)
		args.Err = err
		LogRequest(args)
		return resp, err

	})
})
