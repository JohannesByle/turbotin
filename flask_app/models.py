from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa

db = SQLAlchemy()


class Tobacco(db.Model):
    id = sa.Column(sa.Integer(), primary_key=True, autoincrement=True)
    store = sa.Column(sa.String(100))
    item = sa.Column(sa.String(150))
    link = sa.Column(sa.String(250))
    prices = db.relationship('TobaccoPrice', lazy=True)


class TobaccoPrice(db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    tobacco_id = db.Column(sa.Integer, db.ForeignKey(
        'tobacco.id'), nullable=False)
    price = sa.Column(sa.String(100))
    time = sa.Column(sa.DateTime())
    stock = sa.Column(sa.String(100))


class User(UserMixin, db.Model):
    id = sa.Column(sa.Integer, primary_key=True)
    email = sa.Column(sa.String(100), unique=True)
    password = sa.Column(sa.String(100))
    email_verified = sa.Column(sa.Boolean())
    email_code = sa.Column(sa.String(64))
    password_reset_code = sa.Column(sa.String(64))
    latest_auth_email = sa.Column(sa.DateTime())
