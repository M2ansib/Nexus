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

@limiter.exempt
@admin_api.route('/logged_in', methods=['GET'])
def LoggedIn():
    try:
        return jsonify(result=session['logged_in'], session_data_debug=session)
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
        mentors_list = [mentor.user.pk for mentor in Schema.Mentor.objects.all()]
        session['username'] = username
        session['first_name'] = Schema.User.objects.raw({"_id": username}).first().first_name
        # session['mentors'] = mentors_list
        if username in mentors_list:
            session['role'] = 'Mentor'
        else:
            session['role'] = 'Mentee'
        if 'last_login' not in session:
            session['last_login'] = datetime.datetime.utcnow().isoformat()
        session.permanent = True
        return jsonify({"OK": 200, "session_data": dict(session)})
    else:
        log.warning(f"Failed login attempt for user '{username}'")
        return jsonify({"UNAUTHORIZED": 401}), 401

@admin_api.route('/fetch_session_data/<key>')
def fetch_session_data(key):
    return jsonify(value=session.get(key))

@admin_api.route('/fetch/preferences_all')
@limiter.exempt
def fetch_all_preferences():
    return jsonify(data=[sub.name for sub in Schema.Subject.objects.all()])

@admin_api.route('/fetch/preferences')
def fetch_mentee_preferences():
    # print(Schema.Mentee.objects.raw({"_id": session['username']}).first().subjects)
    return jsonify(data=[sub.name for sub in Schema.Mentee.objects.raw({"_id": session['username']}).first().subjects])

@admin_api.route('/create/match_request', methods=['GET', 'POST'])
def create_match_request():
    data = request.get_json()
    
    for pref in data['selectedPreferences']:
        print(pref)
        req = Schema.MatchRequest(
            mentee = Schema.Mentee.objects.raw({"_id": session['username']}).first(),
            subject=Schema.Subject.objects.raw({"_id": pref}).first(),
            cross_institution = True,
            remarks=data['remarks']
        )
        req.save()
    return jsonify(message="Created match request successfully!")

@admin_api.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify(message="Logged out successfully!")

@admin_api.route('/fetch/match_requests')
def render_requests():
    def string_conv(d):
        for k, v in d.items():
            if isinstance(v, dict):
                string_conv(v)
            else:
                d[k] = str(v)
        return d
    def serialize(d):
        d['name'] = 'Unassigned'
        d['email'] = 'N/A'
        d['initials'] = 'N/A'
        d['preferences'] = 'N/A'
        d['verbose_info'] = ''
        if d['grouping'] is not None:
            grouping_obj = Schema.Grouping.objects.raw({"_id": d['grouping']}).first()
            mentors = grouping_obj.mentors
            # d['remarks'] = grouping_obj.remarks
            if len(mentors) > 0:
                d['name'] = f"{mentors[0].user.first_name} {mentors[0].user.last_name}"
                d['email'] = mentors[0].user.email
                d['initials'] = ''.join([n[0] for n in d['name'].split(' ')])
                d['preferences'] = ', '.join([s.name for s in mentors[0].subjects])
                d['verbose_info'] += f"Created on {d['creation_date'].replace(microsecond=0).isoformat()}\n\n\nExpires on {d['expiry_date'].isoformat()}"
            else:
                d['name'] = 'Pending'
        return string_conv(d)

    def serialize_mentor(d):
        d['name'] = 'Unassigned'
        d['email'] = 'N/A'
        d['initials'] = 'N/A'
        d['preferences'] = 'N/A'
        d['verbose_info'] = ''
        d['remarks'] = 'N/A'
        mentees = d['mentees']
        if len(mentees) > 0:
            mentee = mentees[0]
            if type(mentees[0]) == str:
                mentee = Schema.Mentee.objects.raw({"_id": mentees[0]}).first()
            print(mentees[0])
            d['name'] = f"{mentee.user.first_name} {mentee.user.last_name}"
            d['email'] = mentee.user.email
            d['initials'] = ''.join([n[0] for n in d['name'].split(' ')])
            d['preferences'] = ', '.join([s.name for s in mentee.subjects])
            d['verbose_info'] += f"Created on {d['creation_date'].replace(microsecond=0).isoformat()}"
        return string_conv(d)
    if session['role'] == 'Mentee':
        return jsonify(requests=[serialize(x.to_son().to_dict()) for x in Schema.MatchRequest.objects.raw({"mentee": session['username']})])
    else:
        current_groups = []
        for group in Schema.Grouping.objects.all():
            # print("Test:", session['username'] in [m.user.email for m in group.mentors])
            if session['username'] in [m.user.email for m in group.mentors]:
                current_groups.append(group)
            
        return jsonify(requests=[serialize_mentor(x.to_son().to_dict()) for x in current_groups])

@admin_api.route('/register_user', methods=['GET', 'POST'])
def register_user():
    data = request.get_json()
    user = Schema.User(
        email = data['email'],
        recovery_email = data['recoveryEmail'],
        first_name = data['firstName'],
        last_name= data['lastName'],
        password= data['password'],
        age = int(data['age']),
        role='User',
        institution=Schema.Institution.objects.raw({"_id":"Test"}).first(),
        reputation=0
    )
    user.save()
    if data['role'] == 'Local':
        Schema.Mentor.objects.create(
            user=user, 
            level=Schema.Level.objects.all().first(),
            subjects=data['selectedPreferences']
        )
    elif data['role'] == 'International':
        Schema.Mentee.objects.create(
            user=user, 
            level=Schema.Level.objects.all().first(),
            subjects=data['selectedPreferences']
        )
    return jsonify(message="Registration complete! You may now log in with these credentials.")

def validateLogin(user, pwd):
    # TODO: Use db.Users table for user validation
    SECRET_PASSWORD = generate_password_hash('123')
    return user == 'admin' and check_password_hash(SECRET_PASSWORD, pwd)

# @admin_api.route('/fetch_pairings')
# def fetch_pairings():
#     username = session['username']


# @admin_api.route('/logout', methods=['GET'])
# def logout():
#     session.pop("logged_in", None)
#     session.pop("username", None)
#     return jsonify({"OK": 200})


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


