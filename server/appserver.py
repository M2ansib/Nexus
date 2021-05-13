from flask import Flask, jsonify, request, Response, session, redirect, url_for, make_response
import flask_login
import logging
import os
from datetime import timedelta

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# import dbutils as db
from admin_routes import admin_api, User, db_api
# from db_routes import db_api

from flask_session import Session
from flask_mail import Mail
from flask_cors import CORS, cross_origin

from Schema import *


fmt = "[%(asctime)s]|%(levelname)s|[%(module)s]:%(funcName)s()|%(message)s"
logging.basicConfig(format=fmt)
log = logging.getLogger()
log.setLevel(logging.INFO)

SERVE_SPA = True
SPA_DIR = '../client/dist/prod'
SESSION_TIMEOUT = 60

app = Flask(__name__, static_folder=SPA_DIR, static_url_path='/')
app.register_blueprint(admin_api)
app.register_blueprint(db_api)

mail = Mail()
mail.init_app(app)

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)
CORS(app)

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

app.config.update(
    SECRET_KEY=os.urandom(16),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)

app.permanent_session_lifetime = timedelta(minutes=SESSION_TIMEOUT)

# Create the database if it doesn't exist
# db.connect()

@app.errorhandler(429)
def ratelimit_handler(e):
    return make_response(
        jsonify(error=f"Rate limit exceeded: {e.description}")
        , 429
    )


@login_manager.user_loader
def load_user(user_id):
    return User(user_id)


@login_manager.unauthorized_handler
def unauthorized_callback():
    log.warning(f"UNAUTHORIZED [{request.method}] {request.full_path}")
    return Response("UNAUTHORIZED", 401)


@app.errorhandler(404)
def request_not_found(err):
    if SERVE_SPA:
        return app.send_static_file('index.html')
    else:
        return jsonify({'error': str(err)})


@app.before_request
def request_log():
    log.info(f"[{request.method}] {request.full_path}")


@app.before_request
def refresh_session():
    session.modified = True


@app.after_request
def apply_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    if request.blueprint == 'db_api':
        response.headers['Cache-Control'] = 'no-store'
    return response

# @app.route('/', methods=['GET'])
# def root():
#     return redirect(url_for('index'))

@app.route('/api', methods=['GET'])
def index():
    return Response("OK", 200)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
