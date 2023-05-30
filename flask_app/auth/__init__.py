import binascii
import os
from urllib.parse import urlencode

from flask import (abort, flash, redirect, request, session)
from flask_smorest import Blueprint, abort
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_app.util import error_msg

from scripts.email_methods import send_email
from .util import send_email_safely, send_email_verification_code, send_password_reset_code
from .. import STATIC_FOLDER, login_manager
from ..models import User, db
import marshmallow as ma

bp = Blueprint('auth', __name__, url_prefix='/auth')


def create_code():
    return binascii.hexlify(os.urandom(32)).decode()


def find_user(user_id: int) -> User:
    user = User.query.filter_by(id=user_id).first()
    if not user:
        flash('User not found', 'error')
        abort(409)
    return user


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


class LoginArgs(ma.Schema):
    email = ma.fields.String(required=True)
    password = ma.fields.String(required=True)
    remember = ma.fields.Boolean()


@bp.route('/login', methods=['POST'])
@bp.arguments(LoginArgs)
def login(args):
    email = args['email']
    password = args['password']
    remember = args['remember']

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        flash('Password/email is incorrect', 'error')
        abort(401)

    login_user(user, remember=remember)
    return {}


class SignupArgs(ma.Schema):
    email = ma.fields.String(required=True)
    password = ma.fields.String(required=True)


@bp.route('/signup', methods=['POST'])
@bp.arguments(SignupArgs)
def signup(args):
    email = args['email']
    password = args['password']

    user = User.query.filter_by(email=email).first()
    if user:
        flash('A user with that email already exists', 'error')
        abort(409)
    new_user = User(
        email=email,
        password=generate_password_hash(password, method='sha256'),
        email_code=create_code(),
        email_verified=False,
    )
    db.session.add(new_user)
    db.session.commit()
    send_email_verification_code(new_user)
    flash('Account created! Please verify your email address', 'success')
    return redirect('/login')


class UserDetails(ma.Schema):
    email = ma.fields.String(required=True)
    email_verified = ma.fields.Boolean(required=True)


@bp.route('/get_current_user', methods=['POST'])
@bp.response(200, UserDetails)
@login_required
def get_current_user():
    return current_user


class ChangePasswordArgs(ma.Schema):
    old_password = ma.fields.String(required=True)
    new_password = ma.fields.String(required=True)


@bp.route('/change_password', methods=['POST'])
@bp.arguments(ChangePasswordArgs)
@login_required
def change_password(args):
    old_password = args['old_password']
    new_password = args['new_password']

    if not check_password_hash(current_user.password, old_password):
        flash('Old password is not correct', 'error')
        abort(409)
    user = User.query.filter_by(id=current_user.id).first()
    user.password = generate_password_hash(new_password, method='sha256')
    db.session.commit()
    flash('Password changed', 'success')
    return {}


@bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash('Logged out', 'info')
    return {}


@bp.route("/delete_account")
@login_required
def logout():
    user = User.query.filter_by(id=current_user.id).first()
    db.session.delete(user)
    db.session.commit()
    flash('Account deleted', 'info')
    return {}


@bp.route("/verify_email/<user_id>/<email_code>")
def verify_email(user_id, email_code):
    user = find_user(user_id)
    if user.email_verified:
        return error_msg('Email already verified')
    elif email_code == user.email_code:
        user.email_verified = True
        db.session.commit()
        flash('Email verified', 'success')
    else:
        abort(409)
    return redirect('/')


class ResetPasswordArgs(ma.Schema):
    email = ma.fields.String(required=True)


@bp.route('/reset_password', methods=['POST'])
@bp.arguments(ResetPasswordArgs)
def reset_password_post(args):
    email = args['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('Email not found!', 'error')
        abort(409)
    user.password_reset_code = create_code()
    if not send_password_reset_code(user):
        flash('Unable to send email', 'error')
        abort(409)
    db.session.commit()
    flash('A password reset code has been sent to your email.', 'success')
    return {}


@bp.route("/reset_password/<user_id>/<password_reset_code>", methods=['GET'])
def reset_password(user_id, password_reset_code):
    user = find_user(user_id)
    if user.password_reset_code != password_reset_code:
        return error_msg('Invalid password code')
    params = {"password_reset_code": password_reset_code,
              "user_id": user_id,
              "email": user.email}
    return redirect(f'/change_password?{urlencode(params)}')


class ResetChangePasswordArgs(ma.Schema):
    password_reset_code = ma.fields.String(required=True)
    user_id = ma.fields.Int(required=True)
    new_password = ma.fields.String(required=True)


@bp.route('/reset_password_change', methods=['POST'])
@bp.arguments(ResetChangePasswordArgs)
def change_password(args):
    password_reset_code = args['password_reset_code']
    user_id = args['user_id']
    new_password = args['new_password']
    user = find_user(user_id)
    if user.password_reset_code != password_reset_code:
        flash('Invalid password code', 'error')
        abort(409)
    user.password = generate_password_hash(new_password, method='sha256')
    user.password_reset_code = None
    db.session.commit()
    flash('Password changed', 'success')
    return {}
