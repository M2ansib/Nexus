"""
Module containing all PyMODM definitions pertaining to the API.
"""

# [TODO] Update official DB spec repository to reflect changes made in this version.

__version__ = '3.0.0-alpha'

from enum import unique
from bson.objectid import ObjectId
import Generator

from pymongo import TEXT, errors
from pymongo.operations import IndexModel
from pymodm import fields, MongoModel, EmbeddedMongoModel
from pymongo.write_concern import WriteConcern
from pymodm.connection import DEFAULT_CONNECTION_ALIAS, connect

from pymodm.queryset import QuerySet
from pymodm.manager import Manager

import pymongo

import datetime

from apscheduler.schedulers.background import BackgroundScheduler

import os

import logging
import warnings
import pprint

pprinter = pprint.PrettyPrinter(indent=4)

from dotenv import load_dotenv; load_dotenv()  # take environment variables from '.env'.

# pnconfig = PNConfiguration()

# pnconfig.subscribe_key = 'mySubscribeKey'
# pnconfig.publish_key = 'myPublishKey'
# pnconfig.uuid = 'myUniqueUUID'
# pubnub = PubNub(pnconfig)

LOGGING_FORMAT = "[%(asctime)s]|%(levelname)s|[%(module)s]:%(funcName)s()|%(message)s"
logging.basicConfig(
    format=LOGGING_FORMAT,
    level=logging.NOTSET,
    handlers=[
        logging.FileHandler(f"{__name__}.log"),
        logging.StreamHandler()
    ]
)
logging.captureWarnings(capture=True)
log = logging.getLogger()

class Exceptions:

    """
        A class containing exceptions to be handled by the API.
    """

    class OperationalError(Exception):
        """General exception raised for client-sided runtime errors in using the abstraction.

        Attributes:
            message -> explanation of the error
        """

class Utilities:
    
    """
        A class containing static utility functions that interface directly with PyMODM.\n
    """

    class Validators:

        @staticmethod
        def Validator_CountryCode(string:str):
            pass

        @staticmethod
        def Validator_Timezone(string:str):
            pass

    @staticmethod
    def safe_bulk_create(model, objects:list):
        """
            Utility function that suppresses PyMODM messages when duplicate items are added.
            .. note:: This function should only be used for populating internal collections, e.g. Subject, Level and Institution.
        """
        try:
            model.objects.bulk_create(objects, full_clean=False)
        except errors.BulkWriteError as e:
            print(f"[WARN] Suppressed {type(e).__name__}\n{pprinter.pformat(e.details)}")
            # if 'E11000 duplicate key error collection' in e.__traceback__:
            #     print(f"[WARN] Duplicate keys in bulk creation code, ignoring.")

    @staticmethod
    def SortedSetList(*args):
        """
            Utility function that creates a list with unique elements, all sorted in ascending order.
        """
        return sorted(list(set(args)))

    @staticmethod
    def FetchExpirationDate():
        """
            Utility function that will be called by PyMODM when creating a new MatchRequest.
            Returns a ```datetime``` object ```Config.MATCH_REQUEST_EXPIRY_TIMEDELTA``` away from today (in UTC time).
        """
        return datetime.datetime.utcnow() + Config.MATCH_REQUEST_EXPIRY_TIMEDELTA

    @staticmethod
    def MultiCriteriaSort(xs:list, specs):
        """
            Utility function for performing a multi-criteria stable sort.\n
            Arguments:
                param1 (`list`): The list to be sorted.
                param2 (:obj:`tuple`): A tuple of tuples, each nested tuple containing a key (preferably an anonymous/lambda function) and the sort order to use.
                    For sort order, ascending is denoted by 1 while descending is denoted by -1.

            Returns:
                `list`: The sorted list.
        """
        for key, order in reversed(specs):
            reverse = order <= 0
            xs.sort(key=key, reverse=reverse)
        return xs

class Config:

    """
        Overarching static class containing all tunable attributes.
        Constants that need to be tweaked by developers depending on environmental factors are to be placed here.
    """
    
    def __setattr__(self, name, value):
        """
            Python's internal function for setting attributes.
            Intentionally set blank so as to prevent developers from accidentally assigning to an attribute within this class.
        """
        raise BaseException("This class must not be modified at runtime. All attributes must be set prior to running the program.")

    MAX_BOOKINGS_PER_INTERVAL = 14
    '''Specifies the maximum number of Groupings/Pairings a ```User``` may be added to throughout a pre-defined span of time (as specified by ```COOLDOWN_TIMEDELTA```).'''

    COOLDOWN_TIMEDELTA = datetime.timedelta(minutes=4)
    '''Specifies the span of time after which to reset the ```User.vacancies``` attribute for each ```User```.'''

    MATCH_REQUEST_EXPIRY_TIMEDELTA = datetime.timedelta(minutes=6)
    '''Specifies the default span of time before a ```MatchRequest``` is deemed to have expired.'''

    MATCHING_COROUTINE_TIMEDELTA = datetime.timedelta(minutes=.4)
    '''Specifies the default interval between subsequent calls of the matching coroutine.'''

    DEFAULT_TIMEZONE = 'UTC'
    '''Specifies the timezone in which the coroutine scheduler should operate.'''

    DEFAULT_MENTOR_LIMIT = 1
    '''Specifies the default mentor threshold for each ```Grouping```.'''
    
    DEFAULT_MENTEE_LIMIT = 1
    '''Specifies the default mentee threshold for each ```Grouping```.'''

    ALLOW_MULTIPLE_MENTORS_IN_GROUPING = False
    '''
    Specifies whether Groupings with multiple Mentors are permitted.
    If set to `False`, defaults to a Mentor threshold of 1.
    '''

scheduler = BackgroundScheduler({'apscheduler.timezone': Config.DEFAULT_TIMEZONE})

def EstablishConnection():
    username = os.environ["MONGO_USERNAME"]
    password = os.environ["MONGO_PASSWORD"]
    connect(f"mongodb+srv://{username}:{password}@ascent-cluster.xrvua.mongodb.net/myFirstDatabase")

def EstablishPymongoConnection():
    import pymongo
    username = os.environ["MONGO_USERNAME"]
    password = os.environ["MONGO_PASSWORD"]
    client =   pymongo.MongoClient(f"mongodb+srv://{username}:{password}@ascent-cluster.xrvua.mongodb.net")
    db = client["myFirstDatabase"]
    return db

DEFAULT_CONNECTION_ALIAS = 'leap-api'

class Institution(MongoModel):

    """
    Internal collection for storing institutional details.
    Note that the ```name``` for each ```Institution``` has to be unique.
    """

    name = fields.CharField(primary_key=True)
    '''Name of the institution - has to be unique.'''

    domain = fields.URLField(required=True)
    '''
    URL to the institution\'s landing page. 
    This is used for auto-detecting the User\'s institution from their email address during registration.
    '''

class Role(MongoModel):
    """
    Internal collection for storing user roles as a set of enumerations.
    """
    name = fields.CharField(min_length=3, max_length=16, primary_key=True)

class User(MongoModel):

    """
        Root collection for Mentors, Mentees and Admins.
    """

    email = fields.EmailField(primary_key=True)
    '''
        Primary email address of the User - required for logging into the Portal.
    '''

    recovery_email = fields.EmailField(required=False)
    '''
        Secondary email, for use in case the user forgets their credentials.
        Must not be the same as the primary email address.
    '''

    first_name = fields.CharField(min_length=1, max_length=30, required=True)
    '''
        First name of the ```User```, required for addressing the ```User``` in emails and welcome banners.
    '''

    last_name = fields.CharField(max_length=30)
    '''
        Self-explanatory.
    '''

    password = fields.CharField()
    '''
        Encypted password hash of the User. 
        Contains the encryption method, salt and iteration count (required paramaters for decryption).
    '''

    phone = fields.CharField()
    '''
        Hash of phone number, used for multi-factor authentication. 
        Follows same storage convention as the password.
    '''

    age = fields.IntegerField(min_value=16, required=True)
    '''
        Self-explanatory.
    '''

    role = fields.ReferenceField(model=Role, required=True)
    '''
        User role, for permission/access control.
    '''

    institution = fields.ReferenceField(model=Institution)
    '''
        Reference to the user\'s ```Schema.Institution```.
    '''

    # country = fields.CharField(validators=[Utilities.Validators.Validator_CountryCode])
    # '''
    #     Stores the ISO 3166-1 alpha-2 code of the User's country.
    #     Used to autofill country codes and validate phone number inputs.
    # '''

    # timezone = fields.CharField(validators=[Utilities.Validators.Validator_Timezone])
    # '''
    #     Used to localize timestamps across the User's frontend, and in emails.
    #     May also be used to detect and account for time offsets arising from factors such as daylight savings.
    # '''

    reputation = fields.IntegerField(default=0) 
    '''
        Reputation points (REP).
        To penalize users that abuse the system, e.g. by repeatedly leaving assigned Groupings.
        Users with higher reputation points enjoy perks such as increased match priority.
        May also be used for incentivising active and proper usage of the system (to be implemented).
    '''

    class Meta:
        write_concern = WriteConcern(j=True)

class Notification(MongoModel):
    """
    Internal collection for storing messages for each User.
    Messages older than 2 weeks are to be purged by a Coroutine.
    """
    user = fields.ReferenceField(User)
    creation_date = fields.DateTimeField(default=datetime.datetime.utcnow)
    object_id = fields.ObjectIdField(default=lambda: ObjectId())
    '''Globally unique identifier for the object. Not collision-prone unless, of course, you're churning out 16 million documents per millisecond.'''
    title = fields.CharField()
    message = fields.CharField()
    acknowledged = fields.BooleanField(default = False)

class Level(MongoModel):
    """
        Internal collection for storing the educational level of each User.
    """
    name = fields.CharField(primary_key=True)
    '''Unique, human-readable identifier for ```Level```.'''

# class SubjectKey(EmbeddedMongoModel):
#     pass

class Subject(MongoModel):
    """
        Internal collection for storing subject-related details.
    """
    name = fields.CharField(primary_key=True)
    '''Unique, human-readable identifier for ```Subject```.'''
    level = fields.ReferenceField(Level)
    '''Self-explanatory.'''
    object_id = fields.ObjectIdField(default=lambda: ObjectId())
    '''Globally unique identifier for the object. Not collision-prone unless, of course, you're churning out 16 million documents per millisecond.'''

    # class Meta:
    #     indexes = [pymongo.IndexModel(keys=[('level', pymongo.ASCENDING), ('name', pymongo.ASCENDING)], unique=True)]

class Mentor(MongoModel):

    """
        Collection for storing mentor details.
        Requires referencing a ```User```.
    """

    user = fields.ReferenceField(model=User, primary_key=True)
    '''Reference to the underlying ```User```.'''
    
    subjects = fields.ListField(field=fields.ReferenceField(model=Subject))
    '''List of references to the subjects the Mentor is able to teach.'''
    
    level = fields.ReferenceField(model=Level, required=True)
    '''Reference to the ```Level``` the mentor specializes in teaching.'''

    vacancies = fields.IntegerField(default=Config.MAX_BOOKINGS_PER_INTERVAL)
    '''Number of times the Mentor may be added to a Grouping within a timeframe defined by ```COOLDOWN_TIMEDELTA```.'''

    def is_available(self):
        return self.vacancies >= 1

    def reset_vacancy_counter(self):
        self.vacancies = Config.MAX_BOOKINGS_PER_INTERVAL
        self.save()

    def fetch_groupings(self):
        return Grouping.objects.raw({
            'mentors': {"$in": [self.to_son().to_dict()]}
        })

class Mentee(MongoModel):

    """
        Collection for storing mentee details.
        Requires referencing a ```User```.
    """

    user = fields.ReferenceField(model=User, primary_key=True)
    '''Reference to the underlying ```User```.'''
    
    level = fields.ReferenceField(model=Level)
    '''Reference to the ```Level``` the mentee is currently in.'''
    
    pair_mode = fields.BooleanField(default=False)
    '''Stores whether the mentee strictly wants to be in a ```Pairing```.'''
    
    subjects = fields.ListField(field=fields.ReferenceField(model=Subject))
    '''List of references to the subjects the Mentee is currently taking.'''

    vacancies = fields.IntegerField(default=Config.MAX_BOOKINGS_PER_INTERVAL)
    '''Number of times the Mentee may be added to a Grouping within a timeframe defined by ```COOLDOWN_TIMEDELTA```.'''

    def is_available(self):
        return self.vacancies >= 1

    def fetch_groupings(self):
        return Grouping.objects.raw({
            'mentees': {"$in": [self.to_son().to_dict()]}
        })

    def reset_vacancy_counter(self):
        self.vacancies = Config.MAX_BOOKINGS_PER_INTERVAL
        self.save()

class GroupingManager(Manager):
    """
        Extends the base Manager to add database maintenance methods.
    """

    def fetch(self):
        return super(GroupingManager, self).get_queryset().raw(
            {
                "archived": False
            }
        ).order_by([("max_mentees", pymongo.DESCENDING)]) # Pairings will be processed last.
    
    def prune_transient_groupings(self):
        """
            Clears out expired/inactive Groupings from the MatchQueue.
        """
        transients = super(GroupingManager, self).get_queryset().raw(
            {
                "meeting_date": {
                    "lte": datetime.datetime.utcnow()
                },
                "archived": False
            }
        )

        for grouping in transients:
            grouping.archive()

class Grouping(MongoModel):
    """
        Base class for all Groupings and Pairings.
    """
    creation_date = fields.DateTimeField(default=datetime.datetime.utcnow)
    object_id = fields.ObjectIdField(default=lambda: ObjectId())
    '''Globally unique identifier for the object. Not collision-prone unless, of course, you're churning out 16 million documents per millisecond.'''
    subject = fields.ReferenceField(model=Subject)
    level = fields.ReferenceField(model=Level)
    meeting_date = fields.DateTimeField(required=True, default = lambda: datetime.datetime.utcnow() + datetime.timedelta(days=2))
    max_mentors = fields.IntegerField(min_value=1, max_value=Config.DEFAULT_MENTOR_LIMIT, required=True)
    max_mentees = fields.IntegerField(min_value=1, max_value=Config.DEFAULT_MENTEE_LIMIT, required=True)
    mentors = fields.ListField(field=fields.ReferenceField(model=Mentor), default=lambda: [], blank=True)
    mentees = fields.ListField(field=fields.ReferenceField(model=Mentee), default=lambda: [], blank=True)
    objects = GroupingManager()
    archived = fields.BooleanField(default=False)

    # recurrence_interval = fields.DateTimeField(required=False)

    # Predicates
    def contains(self, user):
        """
            Predicate for checking whether there are users with the supplied ```User```/```Mentor```/```Mentee``` object's ID.
            This prevents cases where the same ```User``` has been assigned as a ```Mentor``` and ```Mentee``` in the same ```Grouping```.
        """
        if isinstance(user, Mentor) or isinstance(user, Mentee):
            user_obj = user.user
        elif isinstance(user, User):
            user_obj = user
        return user_obj in [x.user for x in self.mentors + self.mentees]
    
    def reached_mentee_threshold(self):
        '''
        Predicate for determining whether the mentee limit for the Grouping/Pairing has been reached.
        '''
        return len(self.mentees) == self.max_mentees

    def reached_mentor_threshold(self):
        '''
        Predicate for determining whether the mentor limit for the Grouping/Pairing has been reached.
        '''
        return len(self.mentors) == self.max_mentors

    def is_functional(self):
        '''
        Predicate for checking if the group minimally fulfils the criteria for a Pairing.
        '''
        return len(self.mentees) >= 1 and len(self.mentors) >= 1

    def is_archived(self):
        return self.archived

    def archive(self):
        self.archived = True

    def get_mentee_count(self):
        return len(self.mentees)

    def get_mentor_count(self):
        return len(self.mentors)

    def process(self):
        '''
        Assigns a suitable Mentor to the Grouping.
        '''
        if len(self.mentors) >= Config.DEFAULT_MENTOR_LIMIT:
            log.warning(f"Will not assign another Mentor to Grouping ({self.to_son().to_dict()}) as the Grouping has reached its mentor limit.")
            return
        suitable_mentors = Mentor.objects.raw({
            'subjects': {'$in': [self.subject.pk]},
            'vacancies': {'$gt': 0}
        })

        suitable_mentors = [x for x in suitable_mentors]
        log.info(f"[DEBUG] Suitable Mentors for Grouping ({self.to_son().to_dict()}): {[x.to_son().to_dict() for x in suitable_mentors]}")
        if not suitable_mentors:
            log.info("No Mentors could be found for this Grouping.")
            # If no suitable mentors were found, exit the method.
            return

        suitable_mentors.sort(key = lambda x: x.vacancies, reverse = True) # Ensure that the algorithm assigns the least busy mentor.

        # Search through the list of sorted suitable Mentors, and assign the first available mentor within this list.
        for mentor in suitable_mentors:
            if not mentor.is_available():
                continue
            else:
                self.add_mentor(mentor)
                self.save()
                break

    def add_mentor(self, mentor:Mentor):
        """
        Adds a Mentor to the Grouping/Pairing, decrementing ```Mentor.vacancies``` by one if a suitable Mentor is found.
        """
        if not isinstance(mentor, Mentor):
            raise Exceptions.OperationalError(f"""
                Failed to add the specified mentor to the {type(self).__name__}. 
                Expected a mentor of type Mentor, but received a {type(mentor).__name__} object instead.
            """)
        if self.contains(mentor):
            log.warning(f"Group ({self.to_son().to_dict()}) already contains this Mentor - skipping...")
            return
        if not mentor.is_available():
            log.warning("Mentor has reached the maximum concurrent bookings limit.")
            return
        mentor.vacancies -= 1
        self.mentors.append(mentor)
        log.warn(f"[DEBUG] Saving Mentor object: {mentor.to_son().to_dict()}")
        mentor.save()
        self.save()

    def add_mentee(self, mentee:Mentee):
        """
        Adds a Mentee to the Grouping/Pairing, decrementing ```Mentee.vacancies``` by one if a suitable Mentor is found.
        """
        if not isinstance(mentee, Mentee):
            raise Exceptions.OperationalError(f"""
                Failed to add the specified mentee to the {type(self).__name__}. 
                Expected a mentee of type Mentee, but received a {type(mentee).__name__} object instead.
            """)
        if self.contains(mentee):
            log.warning("Group already contains this Mentee - skipping...")
            return
        if not mentee.is_available():
            log.warning("Mentee has reached the maximum concurrent bookings limit.")
            return
        if mentee in self.mentees:
            log.warning("Mentee is already in this Grouping.")
            return
        mentee.vacancies -= 1
        self.mentees.append(mentee)
        mentee.save()
        self.save()

    def remove_mentor(self, mentor:Mentor):
        if mentor not in self.mentors:
            log.warning("Mentor is not in this Grouping, and as such can't be removed.")
            return
        self.mentors.remove(mentor)
        mentor.vacancies += 1
        mentor.save()
        self.save()

    def remove_mentee(self, mentee:Mentee):
        if mentee not in self.mentees:
            log.warning("Mentee is not in this Grouping, and as such can't be removed.")
            return
        self.mentees.remove(mentee)
        mentee.vacancies += 1
        mentee.save()
        self.save()

class Pairing(Grouping):
    """
        Subset of Grouping, with a one-to-one relationship.
    """
    max_mentors = fields.IntegerField(min_value=1, max_value=1, default=1, required=False)
    max_mentees = fields.IntegerField(min_value=1, max_value=1, default=1, required=False)

class RequestManager(Manager):

    """
        Overrides the default Manager for MatchRequest, adding priority queue functionality to this collection.

        A priority queue system that sorts MatchRequests by creation date (in ascending order).
        Pair requests are processed only after Group requests, so as to accommodate as many Mentees as possible.
    """

    def fetch(self):
        """
            Fetches only pending requests.
        """
        return super(RequestManager, self).get_queryset().raw(
            {"pending": True}
        ).order_by([("creation_date", pymongo.ASCENDING), ("mentee.reputation", pymongo.DESCENDING)])
    def prune_transient_requests(self):
        """
            Purges complete and expired requests from the database,
            sending out an appropriate e-mail in each case.
            For complete ```MatchRequest```s, a feedback survey will be sent to the ```Mentee```s.
            For expired ```MatchRequest```s, an apology will be sent out to the ```Mentee```s, alongside an option to extend the MatchRequest.
            Expired ```MatchRequest```s with ```purge_exclusion_requested``` enabled will be ignored.
        """
        transients = super(RequestManager, self).get_queryset().raw(
            {
                "expiry_date": {
                    "$lte": datetime.datetime.utcnow()
                },
                "archived": False
            }
        )

        for request in transients:
            if request.pending:
                if request.grouping != None:
                    if not request.grouping.is_functional():
                        request.notify(f"Re: Match Request for {request.mentee.level} {request.subject})",
                            f"All of our mentors are currently busy."
                        )
            else:
                request.notify(f"Re: Match Request for {request.mentee.level} {request.subject}",
                    f"Thank you for using our system!"
                )
                request.archive()

    def enqueue_request(self, request):
        """
            Appends the MatchRequest to the end of the MatchQueue.
        """
        request.save()

    def peek(self):
        return self.fetch().first()
    

class MatchRequest(MongoModel):
    """
        Collection representing a match request from a Mentee.
        Upon submission of the match request form through the Portal, the server will create a MatchRequest
        and enqueue it within the MatchRequest queue.
    """

    mentee = fields.ReferenceField(model=Mentee)
    '''Reference to the requesting ```Mentee```.'''

    subject = fields.ReferenceField(model=Subject, required=True)
    '''Reference to the ```Subject``` that the ```Mentee``` is requesting help for.'''
    
    grouping = fields.ReferenceField(model=Grouping, default=lambda: None, blank=True)
    '''Reference to a Grouping/Pairing that the Mentee is assigned to. Will be initialized as a null value, and will be updated with an actual Grouping/Pairing by the matching algorithm.'''
    
    pending = fields.BooleanField(default=True)
    '''Stores whether the MatchRequest has been fulfilled.'''
    
    creation_date = fields.DateTimeField(default=datetime.datetime.utcnow)
    '''Stores the date of creation for the MatchRequest.'''

    object_id = fields.ObjectIdField(default=lambda: ObjectId())
    '''Globally unique identifier for the object. Not collision-prone unless, of course, you're churning out 16 million documents per millisecond.'''

    expiry_date = fields.DateTimeField(default=Utilities.FetchExpirationDate)
    '''Date on which to purge the request from the database.'''

    cross_institution = fields.BooleanField(default=False)
    '''Whether cross-institutional matches are allowed.'''
    
    objects = RequestManager()
    '''Replaces the base Manager class, allowing for custom queries.'''
    
    remarks = fields.CharField(max_length=300, blank=True)
    '''Any comments the mentee may have for the assigned mentor(s).'''
    
    purge_exclusion_requested = fields.BooleanField(default=True, required=False)
    '''Whether to exclude the request from a purge - only applicable if the request has expired.'''

    pairing_preferred = fields.BooleanField(default=True, required=False)
    '''
        Whether the algorithm should enforce a Pairing for this request.
        If no pairings are found within a reasonable timeframe, an e-mail should be sent out 
        requesting the User to opt for a Grouping instead.
    '''

    archived = fields.BooleanField(default=False)
    
    # Pairings come at a cost, in that they will always be processed after Groupings 
    # so as to accommodate more Mentees.

    def notify(self, title:str, message:str):
        Notification(
            user = self.mentee.user,
            title = title,
            message = message
        ).save()

    def is_archived(self):
        return self.archived

    def archive(self):
        if self.archived:
            log.warning("Request has already been archived - ignoring call.")
            return
        self.archived = True
        self.save()

    def process(self):
        """
            Finds and adds the corresponding Mentee to the most suitable Grouping/Pairing.
        """

        if self.grouping is not None:
            if self.grouping.is_functional():
                log.info(f"Skipping request ({self.to_son().to_dict()}) as the mentee is already in a functional Grouping.")
                return
        
        if not self.cross_institution:
            records = Grouping.objects.raw(
                {
                    'subject': self.subject.to_son().to_dict(),
                    'institution': self.mentee.user.institution.to_son().to_dict(),
                    'level': self.mentee.level.to_son().to_dict()
                }
            )
        else:
            records = Grouping.objects.raw(
                {
                    'subject': self.subject.to_son().to_dict(),
                    'level': self.mentee.level.to_son().to_dict()
                }
            )
        suitable_groupings = []
        for grouping in records:
            if not grouping.reached_mentee_threshold():
                if (self.pairing_preferred == True and grouping.max_mentees == 1) or (self.pairing_preferred == False and grouping.max_mentees > 1):
                    suitable_groupings.append(grouping)
        
        log.info(f"Found the following Groupings for request {self.to_son().to_dict()}: {suitable_groupings}")
        
        if len(suitable_groupings) == 0 and self.grouping is None:
            log.info(f"No suitable Groupings found for Mentee: {self.mentee.to_son().to_dict()} - creating new Grouping for Mentee.")
            new_grouping = Grouping (
                subject = self.subject,
                level = self.mentee.level,
                max_mentors = Config.DEFAULT_MENTOR_LIMIT,
                max_mentees = 1 if self.pairing_preferred else Config.DEFAULT_MENTEE_LIMIT,
                mentors = [],
                mentees = []
            )
            new_grouping.add_mentee(self.mentee)
            new_grouping.save()
            self.grouping = new_grouping
        elif len(suitable_groupings) > 0:
            suitable_groupings = Utilities.MultiCriteriaSort(suitable_groupings, [(lambda g: g.get_mentee_count(), 1), (lambda g: g.get_mentor_count(), -1)])
            # suitable_groupings.sort(key = lambda g: g.get_mentee_count)
            chosen_grouping = suitable_groupings[0]
            chosen_grouping.add_mentee(self.mentee)
            chosen_grouping.save()
            self.grouping = chosen_grouping
        
        self.save()

    def extend_deadline(self):
        """
        Increments the expiry date for the ```MatchRequest``` by the duration specified in ```Config.MATCH_REQUEST_EXPIRY_TIMEDELTA```.
        """
        self.expiry_date += Config.MATCH_REQUEST_EXPIRY_TIMEDELTA
        self.save()

if __name__ == "__main__":
    # Prevent long-running, thread-blocking or database-altering operations from being run by 
    # external modules by adding them here.
    # This allows 'pydoc3' to be run without causing the 'DoesNotExist' error,
    # due to differing '_cls' values within each PyMODM document.
    EstablishConnection()
    Generator.populate()
    from IPython import embed; embed()

"""
PROCEDURE:
    MatchRequests are only added if the Mentee has not exceeded the request limit.
    Before processing the requests using the Grouping algorithm, cluster and apply
    a secondary sort to the MatchRequests by class.
    For each pending MatchRequest:
        If there are no suitable Groupings for a MatchRequest, 
        i.e. MatchRequest.get_suitable_groupings() yields [],
        add the MatchRequest's Mentee to a new Grouping.
    2:
        Concatenate similar Groupings wherever possible, 
        deleting the newer Groupings in the process.
    3:
    N.B. This procedure is also applicable for Pairings.
"""

"""
    When user signs up/submits a request for a new pairing ->
    User's request sent to a priority queue (FIFO queue)
    - Queue is cleared once daily
    If the user's subject+level matches an existing and vacant grouping -> add them to group
    If not, create new group

    When user requests to see mentor information, the grouping is pulled
    from the database, the mentors are sorted based on competency in their
    subjects, the mentees are sorted based on priority.

    Match them accordingly, send them out.
"""

@scheduler.scheduled_job('interval', id='matching_coroutine', seconds=Config.MATCHING_COROUTINE_TIMEDELTA.total_seconds())
def MatchingCoroutine():
    """
        Main coroutine for the matching algorithm.
    """
    MatchRequest.objects.prune_transient_requests()
    Grouping.objects.prune_transient_groupings()
    for request in MatchRequest.objects.fetch():
        log.info(f"Processing request: {request.to_son().to_dict()}")
        request.process()
    for grouping in Grouping.objects.fetch():
        log.info(f"Processing group/pairing: {grouping.to_son().to_dict()}")
        grouping.process()

@scheduler.scheduled_job('interval', id='quota_reset_coroutine', seconds=Config.COOLDOWN_TIMEDELTA.total_seconds())
def QuotaResetCoroutine():
    """
        Coroutine for resetting the vacancies value for all Mentors and Mentees.
    """
    for mentor in Mentor.objects.all():
        log.info(f"Resetting vacancies for {mentor.to_son().to_dict()}...")
        mentor.reset_vacancy_counter()
    for mentee in Mentee.objects.all():
        log.info(f"Resetting vacancies for {mentee.to_son().to_dict()}...")
        mentee.reset_vacancy_counter()

log.info(f"\n⚠️ Activating scheduled coroutines: {[f'{j.name} ({j.id})' for j in scheduler.get_jobs()]}\n")
# scheduler.start()