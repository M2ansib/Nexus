from flask import jsonify, request, Response, session, Blueprint, send_file
from ics import Calendar, Event
import datetime
import requests
from werkzeug.security import check_password_hash, generate_password_hash
import flask_login
import logging
import json
log = logging.getLogger(__name__)

admin_api = Blueprint('admin_api', __name__, url_prefix='/api')
db_api = Blueprint('db_api', __name__, url_prefix='/db_api')

class User(flask_login.UserMixin):
    def __init__(self, userid):
        self.id = userid

from appserver import limiter

@admin_api.route('/login', methods=['POST'])
def login():
    record = request.get_json()
    pwd = record.pop('password', "")
    username = record.pop('username', "")
    username = username.lower()

    if validateLogin(username, pwd):
        flask_login.login_user(User(username))
        session.permanent = True
        return jsonify({"OK": 200})
    else:
        log.warning(f"Failed login attempt for user '{username}'")
        flask_login.logout_user()
        return Response(jsonify({"UNAUTHORIZED": 401}), 401)


def validateLogin(user, pwd):
    # TODO: Use db.Users table for user validation
    SECRET_PASSWORD = generate_password_hash('123')
    return user == 'admin' and check_password_hash(SECRET_PASSWORD, pwd)


@admin_api.route('/logout', methods=['GET'])
@flask_login.login_required
def logout():
    flask_login.logout_user()
    return jsonify({"OK": 200})


@admin_api.route('/write_to_cal', methods=['POST'])
def write_to_cal():
    c = Calendar(requests.get('http://localhost:8080/api/get_cal').text)
    e = Event()
    e.name = request.values["name"]
    e.begin = request.values["begin"]
    e.end = request.values["end"]
    print(request.values["attendees"])
    for attendee in request.values["attendees"].split(","):
        print(attendee)
        e.add_attendee(attendee)
    c.events.add(e)
    with open('./cal.ics', 'w') as f:
        f.write(str(c))
    return jsonify({"OK": 200})

@admin_api.route('/get_cal', methods=['GET'])
def get_cal():
    return send_file('cal.ics', attachment_filename="calendar.ics")


@admin_api.route('/whoami', methods=['GET'])
@flask_login.login_required
def getUser():
    user = ''
    if flask_login.current_user.is_authenticated:
        user = flask_login.current_user.get_id()
    return jsonify({'success': {'user': user}})

import time
@admin_api.route('/time')
@limiter.exempt
def get_current_time():
    return {'time': time.time()}


@admin_api.route('/ping', methods=['GET'])
@flask_login.login_required
def keepAlive():
    return jsonify({"OK": 200})
