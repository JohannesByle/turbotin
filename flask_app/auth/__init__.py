from flask import Blueprint, render_template, request, flash, redirect, url_for
from scripts.email_methods import send_email
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import login_user, logout_user, login_required
from ..models import User
from .. import db
import json
import os
import binascii

auth_blueprint = Blueprint('auth', __name__)


def create_code():
    return binascii.hexlify(os.urandom(32)).decode()


def send_email_safely(user, subject, body):
    if user.latest_auth_email and datetime.now() - user.latest_auth_email < timedelta(minutes=1):
        flash("An email was already recently sent, please wait a few minutes before making another request.", "danger")
        return False
    user.latest_auth_email = datetime.now()
    db.session.commit()
    send_email(user.email, subject=subject, body=body)
    flash('Email sent', "success")
    return True


def send_email_verification_code(user):
    url = request.url_root + url_for("email_verification.verify_email", user_id=user.id, email_code=user.email_code)
    subject = "Your TurboTin.com account email verification code"
    body = "Use this url to verify your email address: {}".format(url)
    return send_email_safely(user, subject, body)


@auth_blueprint.route('/login')
def login():
    return render_template("login.html", next_=request.args.get("next"))


@auth_blueprint.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.', "danger")
        return redirect("/login")

    login_user(user, remember=remember)
    next_ = request.form.get("next")
    return redirect(next_ if next_ else "/email_updates")


@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


@auth_blueprint.route('/signup')
def signup():
    return render_template("signup.html")


@auth_blueprint.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = " ".join([n.title() for n in str(email).split("@")[0].split(".")])
    password = request.form.get('password')
    user = User.query.filter_by(email=email).first()
    if user:
        flash('Email address already exists', "danger")
        return redirect("/signup")
    new_user = User(
        email=email,
        name=name,
        password=generate_password_hash(password, method='sha256'),
        email_code=create_code(),
        email_verified=False,
        email_updates=json.dumps([])
    )
    db.session.add(new_user)
    db.session.commit()
    send_email_verification_code(new_user)
    return redirect("/login")