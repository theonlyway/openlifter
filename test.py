from pymongo import MongoClient
import requests
import json
from operator import itemgetter

def kg2lbs(kg):
    return round(kg * 2.20462262, 2)


def lbs2kgs(kg):
    return round(kg / 2.20462262, 2)


def find_unique_event_combos(entries):
    events = []
    for entry in entries:
        events.extend(entry['events'])
    return list(set(events))


def group_entries_by_weight_class(sex, weight_classes, entries, in_kg):
    if len(weight_classes) == 0:
        return None
    sortedEntries = sorted(entries, key=itemgetter('points'))
    fileteredEntries = {}
    outsideMax = weight_classes[-1:][0]
    outsideMaxKey = str(outsideMax) + "+"
    outsideMaxLbsKey = str(kg2lbs(outsideMax)) + "+"
    for weight_class in weight_classes:
        if in_kg is True:
            fileteredEntries.update({
                str(weight_class): []
            })
        else:
            fileteredEntries.update({
                str(kg2lbs(weight_class)): []
            })
    if in_kg is True:
        fileteredEntries.update({
            outsideMaxKey: []
        })
    else:
        fileteredEntries.update({
            outsideMaxLbsKey: []
        })
    for entry in entries:
        if entry['sex'] == sex:
            for weight_class in weight_classes:
                if in_kg is True:
                    if entry['bodyweightKg'] <= int(weight_class):
                        fileteredEntries[str(weight_class)].append(entry)
                        break
                    elif entry['bodyweightKg'] >= outsideMax:
                        fileteredEntries[outsideMaxKey].append(entry)
                        break
                else:
                    if kg2lbs(entry['bodyweightKg']) <= int(kg2lbs(weight_class)):
                        fileteredEntries[str(
                            kg2lbs(weight_class))].append(entry)
                        break
                    elif kg2lbs(entry['bodyweightKg']) >= kg2lbs(outsideMax):
                        fileteredEntries[outsideMaxLbsKey].append(entry)
                        break
        else:
            continue
    return sortedEntries


def leaderboard_results(data):
    weightClassesKgMen = data['meetData']['weightClassesKgMen']
    weightClassesKgWomen = data['meetData']['weightClassesKgWomen']
    weightClassesKgMx = data['meetData']['weightClassesKgMx']

    entriesByWeightClassesKgMen = group_entries_by_weight_class("M",
                                                                weightClassesKgMen, data['entries'], data['meetData']['inKg'])
    entriesByWeightClassesKgWomen = group_entries_by_weight_class("F",
                                                                  weightClassesKgWomen, data['entries'], data['meetData']['inKg'])
    entriesByWeightClassesKgMx = group_entries_by_weight_class("Mx",
                                                               weightClassesKgMx, data['entries'], data['meetData']['inKg'])

    emptyKeysToRemove = []
    for k, v in entriesByWeightClassesKgMen.items():
        if len(v) > 0:
            continue
        else:
            emptyKeysToRemove.append(k)
    for emptyKey in emptyKeysToRemove:
        entriesByWeightClassesKgMen.pop(emptyKey)

    emptyKeysToRemove = []
    for k, v in entriesByWeightClassesKgWomen.items():
        if len(v) > 0:
            continue
        else:
            emptyKeysToRemove.append(k)
    for emptyKey in emptyKeysToRemove:
        entriesByWeightClassesKgWomen.pop(emptyKey)

    emptyKeysToRemove = []
    for k, v in entriesByWeightClassesKgMx.items():
        if len(v) > 0:
            continue
        else:
            emptyKeysToRemove.append(k)
    for emptyKey in emptyKeysToRemove:
        entriesByWeightClassesKgMx.pop(emptyKey)

    return {
        'male': entriesByWeightClassesKgMen,
        'female': entriesByWeightClassesKgWomen,
        'mx': entriesByWeightClassesKgMx
    }


mongodbConnectionString = "mongodb://api_user:xaw!TNQ7cwp3fdr2cqf@localhost:27017/openlifter"
mongodbClient = MongoClient(mongodbConnectionString,
                            serverSelectionTimeoutMS=5000)
database = mongodbClient["openlifter"]
collection = database["order"]
documents = collection.find({})
data = {
    'meetData': None,
    'entries': []
}
for document in documents:
    data['meetData'] = document['meetData']
    data['entries'].extend(document['order']['orderedEntries'])
leaderboard_results(data)
pass
