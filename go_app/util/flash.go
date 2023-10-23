package util

import (
	"errors"
	pb "turbotin/protos"

	. "connectrpc.com/connect"
)

const (
	FLASH_KEY  = "B9273F67-1395-4751-8AF7-28F3227A56B3"
	STATUS_KEY = "F96945C6-0F7A-4148-9032-56C658233522"
)

func Flash(msg string, severity pb.Severity, resp AnyResponse) {
	resp.Header().Set(FLASH_KEY, msg)
	resp.Header().Set(STATUS_KEY, severity.String())
}

func FlashError[T any](msg string, c Code) (*Response[T], error) {
	resp := NewResponse[T](nil)
	Flash(msg, pb.Severity_SEVERITY_ERROR, resp)
	return resp, NewError(c, errors.New(msg))
}

func InternalError[T any]() (*Response[T], error) {
	return FlashError[T]("Internal error", CodeInternal)
}

func FlashSuccess[T any](msg string, t T) (*Response[T], error) {
	resp := NewResponse[T](&t)
	Flash(msg, pb.Severity_SEVERITY_SUCCESS, resp)
	return resp, nil
}
