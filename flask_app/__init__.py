import json
import os
from flask import Flask, Response, get_flashed_messages
from flask_login import LoginManager, current_user
from flask_smorest import Api
from base64 import b64encode

login_manager = LoginManager()
login_manager.session_protection = "strong"

CURRENT_USER_STR = "4e29cdd3-1156-4093-b50c-263a62426f98"
FLASHES_STR = "52deada2-598d-496f-a122-899d39d7996e"
path = os.path.dirname(__file__)
STATIC_FOLDER = os.path.join(path, "..\\react_app\\build")

# pylint: disable-next=wrong-import-position
from . import auth  # noqa
# pylint: disable-next=wrong-import-position
from .models import db  # noqa


def create_app() -> Flask:

    app = Flask(__name__, static_url_path='/', static_folder=STATIC_FOLDER)

    app.config.from_pyfile('config.py')
    app.config.from_pyfile('private_config.py', silent=True)

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
        response.headers[CURRENT_USER_STR] = auth.UserDetails().dumps(
            current_user)
        flashes = json.dumps([{"msg": m, "color": c}
                             for c, m in get_flashed_messages(with_categories=True)])
        response.headers[FLASHES_STR] = flashes
        if flashes:
            response.set_cookie(FLASHES_STR, b64encode(
                flashes.encode()).decode())
        return response

    api = Api(app)
    api.register_blueprint(auth.bp)

    return app
