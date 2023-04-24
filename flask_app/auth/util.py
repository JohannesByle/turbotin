from datetime import datetime, timedelta

from flask import request, url_for
from scripts.email_methods import send_email

from ..models import User, db


def send_email_safely(user: User, subject: str, body: str) -> bool:
    if user.latest_auth_email and datetime.now() - user.latest_auth_email < timedelta(minutes=1):
        return False
    user.latest_auth_email = datetime.now()
    db.session.commit()
    send_email(user.email, subject=subject, body=body)
    return True


def send_email_verification_code(user: User):
    url = request.url_root + url_for("auth.verify_email",
                                     user_id=user.id, email_code=user.email_code)
    subject = "Your TurboTin.com account email verification code"
    body = f'Verify your email <a href="{url}">here</a>'
    return send_email_safely(user, subject, body)
