from pymongo import MongoClient
import requests
import json

mongodbConnectionString = "mongodb://api_user:xaw!TNQ7cwp3fdr2cqf@localhost:27017/openlifter"
mongodbClient = MongoClient(mongodbConnectionString,
                            serverSelectionTimeoutMS=5000)
database = mongodbClient["openlifter"]
collection = database["order"]
query = {"platform": 1}
lightsUrl = "https://lights.barbelltracker.com/api/last_result"
document = collection.find_one(query)
if "lightsCode" in document['order']:
    try:
        response = requests.get(
            lightsUrl + f"/{document['order']['lightsCode']}")
        jsonResponse = response.json()
        pass
    except:
        raise
    pass
else:
    pass
pass
