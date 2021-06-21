from ics import Calendar, Event
import datetime


def create_event(attendees, name, begin, end):
    c = Calendar()
    e = Event()
    e.name = name
    # e.begin = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    e.begin = begin
    e.end = end
    for attendee in attendees:
        e.add_attendee(attendee)
    c.events.add(e)
    with open('./cal.ics', 'w') as f:
        f.write(str(c))


create_event(["ria.mundhra.2019@vjc.sg"], "testing", datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), (datetime.datetime.utcnow() + datetime.timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S"))
