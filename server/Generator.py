"""
Module that populates the database with dummy or internally-managed data.
"""

def propagate_test_data():
    pass

def populate():
    from Schema import (
        Utilities,
        User, 
        Level, 
        Subject, 
        Mentor, 
        Mentee, 
        MatchRequest, 
        Institution,
        Role
    )

    Utilities.safe_bulk_create(Institution, [Institution(name="Test", domain="test.com")])

    Subjects = Utilities.SortedSetList(
        "Test"
    )

    Subjects = Utilities.SortedSetList(
        "Chess",
        "Café-hopping",
        "Experiential Learning"
    )

    Levels = Utilities.SortedSetList(
        "A-Level",
        "O-Level",
        "IB",
        "IP"
    )

    for level in Levels:
        Utilities.safe_bulk_create(Level, [Level(name=level)])

    for subject in Subjects:
        Utilities.safe_bulk_create(Subject, [Subject(name=subject, level="A-Level")])

    Roles = [
        'Administrator',
        'Moderator',
        'User'
    ]

    for role in Roles:
        Utilities.safe_bulk_create(Role, [Role(name=role)])

    Users = [{
        'email': "mentor@test.com",
        'recovery_email':"recovery1@test.com",
        'institution': Institution.objects.project({'_id':'Test'}).first(),
        'first_name':'Mentor1',
        'last_name':'test',
        'password':'test',
        'phone':88888888,
        'age':0,
        'role':'User',
        'reputation':0
    },
    {
        'email': "mentee@test.com",
        'recovery_email':"recovery2@test.com",
        'institution': Institution.objects.project({'_id':'Test'}).first(),
        'first_name':'Mentee1',
        'last_name':'test',
        'password':'test',
        'phone':88888888,
        'age':0,
        'role':'User',
        'reputation':0
    }
    ]

    for user in Users:
        Utilities.safe_bulk_create(User, [User(**user)])

    # Mentors = [
    #     {
    #         'user': User.objects.project({'_id': 'mentor@test.com'}).first(),
    #         'subjects': [
    #             Subject.objects.project({'_id':'H2 Physics'}).first(), 
    #             Subject.objects.project({'_id':'H2 Computing'}).first()
    #         ],
    #         'level': Level.objects.project({'_id':'A-Level'}).first()
    #     }
    # ]

    # for mentor in Mentors:
    #     Utilities.safe_bulk_create(Mentor, Mentor(**mentor))

    Mentees = [
        {
            'user': User.objects.project({'_id': 'mentee@test.com'}).first(),
            'subjects': [Subject.objects.project({'_id':'H2 Physics'}).first(), Subject.objects.project({'_id':'H2 Computing'}).first()],
            'level': Level.objects.project({'_id':'A-Level'}).first()
        }
    ]

    for mentee in Mentees:
        Utilities.safe_bulk_create(Mentee, Mentee(**mentee))

    # Requests = [
    #     {
    #         'mentee': Mentee.objects.project({'_id':'mentee@test.com'}).first(),
    #         'subject': Subject.objects.project({'_id':'H2 Physics'}).first(),
    #         'grouping': None,
    #         'pending': True,
    #         # 'creation_date': '',
    #         # 'expiry_date': '',
    #         'cross_institution': False
    #     }
    # ]

    # for request in Requests:
    #     Utilities.safe_bulk_create(MatchRequest, [MatchRequest(**request)])
        