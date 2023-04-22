

import os

from flask import Flask, Response
from flask_login import LoginManager, current_user
from flask_smorest import Api

login_manager = LoginManager()
login_manager.session_protection = "strong"

from . import auth  # noqa
from .models import db  # noqa

current_user_str = "4e29cdd3-1156-4093-b50c-263a62426f98"


def create_app() -> Flask:

    app = Flask(__name__, static_url_path='/',
                static_folder='..\\react_app\\build')

    app.config.from_pyfile('config.py', silent=False)

    if not os.path.exists(app.instance_path):
        os.makedirs(app.instance_path)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    login_manager.init_app(app)

    @app.errorhandler(404)
    def base(e):
        return app.send_static_file('index.html')

    @app.after_request
    def add_auth_meta_data(response: Response):
        response.headers[current_user_str] = auth.UserDetails().dumps(
            current_user)
        return response

    api = Api(app)
    api.register_blueprint(auth.bp)

    return app
