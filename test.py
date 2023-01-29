from pymongo import MongoClient
import requests
import json


def calculate_max_lifts(data):
    goodSquat = []
    goodBench = []
    goodDeadlift = []
    for i in range(len(data['squatStatus'])):
        if data['squatStatus'][i] == 1:
            goodSquat.append(data['squatKg'][i])

    for i in range(len(data['benchStatus'])):
        if data['benchStatus'][i] == 1:
            goodBench.append(data['benchKg'][i])

    for i in range(len(data['deadliftStatus'])):
        if data['deadliftStatus'][i] == 1:
            goodSquat.append(data['deadliftKg'][i])
    return {
        'goodLifts': {
            'squat': goodSquat,
            'bench': goodBench,
            'deadlift': goodDeadlift,
        },
        'maxLifts': {
            'squat': max(goodSquat, default=0),
            'bench': max(goodBench, default=0),
            'deadlift': max(goodDeadlift, default=0),
        }
    }

mongodbConnectionString = "mongodb://api_user:xaw!TNQ7cwp3fdr2cqf@localhost:27017/openlifter"
mongodbClient = MongoClient(mongodbConnectionString,
                            serverSelectionTimeoutMS=5000)
database = mongodbClient["openlifter"]
collection = database["order"]
query = {"platform": 1}
document = collection.find_one(query)
calculate_max_lifts(document['order']['orderedEntries'][0])
pass
