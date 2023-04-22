from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa

db = SQLAlchemy()


class Tobacco(db.Model):
    store = sa.Column(sa.String(100))
    item = sa.Column(sa.String(150), primary_key=True)
    price = sa.Column(sa.String(100))
    stock = sa.Column(sa.String(100))
    link = sa.Column(sa.String(250), primary_key=True)
    time = sa.Column(sa.DateTime(), primary_key=True)
    brand = sa.Column(sa.String(500))
    blend = sa.Column(sa.String(500))


class User(UserMixin, db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    email = sa.Column(sa.String(100), unique=True)
    password = sa.Column(sa.String(100))
    email_verified = sa.Column(sa.Boolean())
    email_code = sa.Column(sa.String(64))
    password_reset_code = sa.Column(sa.String(64))
    latest_auth_email = sa.Column(sa.DateTime())


class Dummy(db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    value = sa.Column(sa.String(500))
