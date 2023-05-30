
from flask import Response, redirect


ERROR_MSG_STR = "e19f4dcc-cdde-4c39-9b15-ca0d6eff4367"


def error_msg(msg: str) -> Response:
    resp = redirect('/error')
    resp.set_cookie(ERROR_MSG_STR, msg)
    return resp
