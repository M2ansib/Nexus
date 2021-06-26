from flask import jsonify, request, Response, session, Blueprint, send_file
from ics import Calendar, Event
import datetime
import requests
from werkzeug.security import check_password_hash, generate_password_hash
import logging
import json
import Schema

from functools import wraps

log = logging.getLogger(__name__)

admin_api = Blueprint('admin_api', __name__, url_prefix='/api')
db_api = Blueprint('db_api', __name__, url_prefix='/db_api')

from appserver import limiter

import os

Schema.EstablishConnection()

class Restrictions:
    LOGGED_IN = 1,


# def RESTRICTED(func, _filter):
#     if _filter == Restrictions.LOGGED_IN:
#         if session['username'] not in 

def ValidateCredentials(username, password):
    try:
        return Schema.User.objects.raw({"_id": username}).first().password == password
    except:
        return False

@admin_api.route('/logged_in', methods=['GET'])
def LoggedIn():
    try:
        return jsonify(result=session['logged_in'])
    except KeyError:
        return jsonify(result=False)


@admin_api.route('/login', methods=['POST'])
def login():
    record = request.get_json(force=True)
    pwd = record.pop('password', "")
    username = record.pop('username', "")
    # record['username']
    username = username.lower()

    print("[DEBUG]", request.get_json(force=True))

    if ValidateCredentials(username, pwd):
        session['logged_in'] = True
        if 'last_login' not in session:
            session['last_login'] = datetime.datetime.utcnow().isoformat()
        session.permanent = True
        return jsonify({"OK": 200, "session_data": dict(session)})
    else:
        log.warning(f"Failed login attempt for user '{username}'")
        return jsonify({"UNAUTHORIZED": 401}), 401


def validateLogin(user, pwd):
    # TODO: Use db.Users table for user validation
    SECRET_PASSWORD = generate_password_hash('123')
    return user == 'admin' and check_password_hash(SECRET_PASSWORD, pwd)

# @db_api.route('/fetch_pairings')
# def fetch_pairings():
#     username = session['username']


@admin_api.route('/logout', methods=['GET'])
def logout():
    session.pop("logged_in", None)
    session.pop("username", None)
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
    with open('cal.ics', 'w') as f:
        f.write(str(c))
    return jsonify({"OK": 200})

@admin_api.route('/get_cal', methods=['GET'])
def get_cal():
    return send_file('cal.ics', attachment_filename="cal.ics", cache_timeout=0)

import time
@admin_api.route('/time')
@limiter.exempt
def get_current_time():
    return {'time': time.time()}


