import binascii
import os

from flask import (abort, redirect)
from flask_smorest import Blueprint, abort
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from . import login_manager
from .models import User, db
import marshmallow as ma

bp = Blueprint('auth', __name__, url_prefix='/auth')


def create_code():
    return binascii.hexlify(os.urandom(32)).decode()


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
    print(user)
    if user:
        abort(409)
    new_user = User(
        email=email,
        password=generate_password_hash(password, method='sha256'),
        email_code=create_code(),
        email_verified=False,
    )
    db.session.add(new_user)
    db.session.commit()
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
        abort(409)
    user = User.query.filter_by(id=current_user.id).first()
    user.password = generate_password_hash(new_password, method='sha256')
    db.session.commit()
    return {}


@bp.route("/logout")
@login_required
def logout():
    logout_user()
    return {}


@bp.route("/delete_account")
@login_required
def logout():
    user = User.query.filter_by(id=current_user.id).first()
    db.session.delete(user)
    db.session.commit()
    return {}
