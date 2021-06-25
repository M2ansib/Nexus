from flask import jsonify, request, Response, session, Blueprint, send_file
from ics import Calendar, Event
import datetime
import requests
from werkzeug.security import check_password_hash, generate_password_hash
import logging
import json
import Schema

log = logging.getLogger(__name__)

admin_api = Blueprint('admin_api', __name__, url_prefix='/api')
db_api = Blueprint('db_api', __name__, url_prefix='/db_api')

from appserver import limiter

Schema.EstablishConnection()

def ValidateCredentials(username, password):
    try:
        return Schema.User.objects.raw({"_id": username}).first().password == password
    except:
        return False

@admin_api.route('/logged_in')
def LoggedIn():
    try:
        return session['logged_in']
    except KeyError:
        return False

# @db_api.route('/<collection>', methods=['GET', 'POST', 'PATCH', 'DELETE'])
# def unified_endpoint(collection):
#     if request.method == "GET":
#         return jsonify(data = eval(f"Schema.{collection.capitalize()}").objects.all())

@admin_api.route('/login', methods=['POST'])
def login():
    record = request.get_json()
    pwd = record.pop('password', "")
    username = record.pop('username', "")
    username = username.lower()

    if ValidateCredentials(username, pwd):
        session['logged_in'] = True
        session.permanent = True
        return jsonify({"OK": 200})
    else:
        log.warning(f"Failed login attempt for user '{username}'")
        return Response(jsonify({"UNAUTHORIZED": 401}), 401)


def validateLogin(user, pwd):
    # TODO: Use db.Users table for user validation
    SECRET_PASSWORD = generate_password_hash('123')
    return user == 'admin' and check_password_hash(SECRET_PASSWORD, pwd)


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
    return send_file('cal.ics', attachment_filename="cal.ics")

import time
@admin_api.route('/time')
@limiter.exempt
def get_current_time():
    return {'time': time.time()}

