
class AbstractionError(Exception):
    """General exception raised for runtime errors in using the abstraction.

    Attributes:
        message -> explanation of the error
    """

import datetime
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler({'apscheduler.timezone': 'Asia/Singapore'})

Subjects = {
    "H2 Physics",
    "H2 Chemistry",
    "H2 Mathematics",
    "H2 Economics",
    "H2 Computing"
}

Subjects = sorted(list(Subjects))
Subjects = {Subjects[i]: i for i in range(len(Subjects))}
print(Subjects)

def intersection(lst1, lst2):
    return list(set(lst1) & set(lst2))

class AbstractionConfig:
    def __init__(self):
        self.MAX_BOOKINGS_PER_INTERVAL = 14
        self.COOLDOWN_TIMEDELTA = datetime.timedelta(days=7)
        self.MATCH_REQUEST_EXPIRY_TIMEDELTA = datetime.timedelta(days=7)
        self.MATCHING_COROUTINE_TIMEDELTA = datetime.timedelta(seconds=1)

Config = AbstractionConfig()

class User:
    def __init__(self):
        self.email = ""
        self.recovery_email = "" # Optional
        self.password = ""
        self.phone = ""
        self.age = 0
        self.current_grade = ""
        self.institution = ""
        self.vacancies = Config.MAX_BOOKINGS_PER_INTERVAL

    def send_email(self, message):
        print(f"[EMAIL] ({self.email}): {message}")

class Mentee(User):
    def __init__(self, subjects):
        super().__init__()

        self.subjects = subjects
        # In order of priority: Leftmost subject is the most important. 
        # Each mentee should have 2 subjects.
        self.seeking = True
        
        # self.preferred_learning_style = ""
    # Predicates
    def reached_booking_limit(self):
        return self.vacancies == 0
    def is_seeking(self):
        return self.seeking and (not self.reached_booking_limit())
        
class Mentor(User):
    def __init__(self, subjects_taught:list, mentee_limit: int = 3):
        super().__init__()
        self.mentee_limit = mentee_limit
        self.subjects_taught = subjects_taught

    # Predicates

    def is_available(self) -> bool:
        return self.vacancies > 0


class Grouping:
    def __init__(self, max_mentors, max_mentees):
        self.mentees = []
        self.mentors = []
        self.max_mentors = max_mentors
        self.max_mentees = max_mentees
        self.creation_date = datetime.datetime.utcnow() # i.e. 'timestamp' in legacy API
        self.expiry_date = self.creation_date + Config.MATCH_REQUEST_EXPIRY_TIMEDELTA
        self.remarks = ""
        self.pending = True

    # Accessors    
    def get_max_mentors(self):
        return self.max_mentors

    def get_max_mentees(self):
        return self.max_mentees

    def get_mentee_count(self):
        return len(self.mentees)
    
    def get_mentor_count(self):
        return len(self.mentors)
        
    def get_creation_date(self) -> datetime.datetime:
        return self.creation_date

    def get_expiry_date(self) -> datetime.datetime:
        return self.expiry_date

    # Predicates
    def reached_mentee_threshold(self):
        return self.get_mentee_count() == self.get_max_mentees()

    def reached_mentor_threshold(self):
        return self.get_mentor_count() == self.get_max_mentors()
        
    def is_pending(self):
        return self.pending

    # Modifiers
    def set_max_mentors(self, value):
        if value < self.get_mentor_count():
            raise AbstractionError(f"{type(self).__name__}'s mentor capacity cannot be less than its current size.")
        self.max_mentors = value
        
    def set_max_mentees(self, value):
        if value < self.get_mentee_count():
            raise AbstractionError(f"{type(self).__name__}'s mentee capacity cannot be less than its current size.")
        self.max_mentees = value

    def add_mentor(self, user:Mentor):
        if not isinstance(user, Mentor):
            raise AbstractionError(f"User to be added is not a Mentor.")
        if user in self.mentors or user in self.mentees:
            raise AbstractionError(f"User is already in this {type(self).__name__}.")
        if len(self.mentors) >= self.max_mentors:
            raise AbstractionError(f"This {type(self).__name__} is full.")
        self.mentors.append(user)
        user.vacancies -= 1

    def add_mentee(self, user:Mentee):
        if not isinstance(user, Mentee):
            raise AbstractionError(f"User to be added is not a Mentee.")
        if user in self.mentors or user in self.mentees:
            raise AbstractionError(f"User is already in this {type(self).__name__}.")
        if len(self.mentees) >= self.max_mentees:
            raise AbstractionError(f"This {type(self).__name__} is full.")
        self.mentees.append(user)
        user.vacancies -= 1
        self.is_seeking
        
    def set_pending(self, value:bool):
        if value == False:
            if self.get_mentor_count() == 0 and self.get_mentee_count() > 0:
                for mentee in self.mentees:
                    # Send an email out to the mentees, stating that all 
                    # of our mentors are currently busy.
                    mentee.send_email("All of our mentors are currently unavailable. We will get back to you in due course.")
        self.pending = value

class Pairing(Grouping):
    """
        Subset of Grouping, with a one-to-one relationship.
    """
    def __init__(self):
        super().__init__(max_mentors=1, max_mentees=1)

    # def set_max_mentors(self, value:int):
    #     raise AbstractionError(f"A {type(self).__name__} can only have a single mentor.")

    # def set_max_mentees(self, value:int):
    #     raise AbstractionError(f"A {type(self).__name__} can only have a single mentee.")

class MatchQueue:
    """
        This is a priority queue system that stores pending Groupings in chronological order.
        This system is used to track pending Groupings (i.e. those that still have vacancies and have yet to expire).
        Groupings are dequeued only if the following criteria are met:
        1) Match request has reached the deadline
        2) Matching was completed successfully, i.e. the group/pairing was filled in time.
    """
    def __init__(self):
        self.groupings = []
        
    def enqueue(self, grouping: Grouping):
        self.groupings.append(grouping)

    def refresh(self):
        """
            Repopulates the list of groupings to track by clearing out expired groupings.
            Also resets the 'vacancies' counter of each Mentor on the system (if required).
            This is to be run by the MatchingCoroutine.
        """
        for grouping in self.groupings:
            if grouping.get_expiry_date() >= datetime.datetime.utcnow():
                # If the grouping has expired, invalidate it (i.e. mark it for deletion).
                grouping.set_pending(False)

mentors = [
    Mentor(3,)
]
mentees = []
groupings = []

@scheduler.scheduled_job('interval', id='reset_coroutine', seconds=Config.MATCHING_COROUTINE_TIMEDELTA.total_seconds())
def ResetCoroutine():
    global groupings
    for user in (mentors + mentees):
        user.vacancies = Config.MAX_BOOKINGS_PER_INTERVAL
    groupings = filter(lambda g: g.is_pending(), groupings)
    print (f"[INFO] Reset complete.")

# def FilterGrouping(grouping: Grouping):
#     return grouping.is_pending() == True

@scheduler.scheduled_job('interval', id='matching_coroutine', seconds=Config.MATCHING_COROUTINE_TIMEDELTA.total_seconds())
def MatchingCoroutine():
    global mentees
    print("[INFO] Executing matching coroutine...")
    seeking_mentees = filter(lambda x: x.is_seeking(), mentees)
    for mentee in seeking_mentees:
        suitable_mentors = filter(lambda x: intersection(mentor.subjects_taught))

scheduler.start()
from IPython import embed; embed()