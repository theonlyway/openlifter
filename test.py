from pymongo import MongoClient
import requests
import json


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
    fileteredEntries = []
    outsideMax = weight_classes[-1:][0]
    outsideMaxKey = str(outsideMax) + "+"
    outsideMaxLbsKey = str(kg2lbs(outsideMax)) + "+"
    for weight_class in weight_classes:
        if in_kg is True:
            fileteredEntries.append({
                'weightClass': weight_class,
                'entries': []
            })
        else:
            fileteredEntries.append({
                'weightClass': kg2lbs(weight_class),
                'entries': []
            })
    if in_kg is True:
        fileteredEntries.append({
            'weightClass': outsideMaxKey,
            'outsideMax': True,
            'entries': []
        })
    else:
        fileteredEntries.append({
            'weightClass': outsideMaxLbsKey,
            'outsideMax': True,
            'entries': []
        })
    for entry in entries:
        if entry['sex'] == sex:
            for index in range(len(weight_classes)):
                if in_kg is True:
                    if entry['bodyweightKg'] <= weight_classes[index]:
                        fileteredEntries[index]['entries'].append(entry)
                        break
                    elif entry['bodyweightKg'] > outsideMax:
                        fileteredEntries[len(weight_classes)
                                         ]['entries'].append(entry)
                        break
                else:
                    if kg2lbs(entry['bodyweightKg']) <= kg2lbs(weight_classes[index]):
                        fileteredEntries[index]['entries'].append(entry)
                        break
                    elif kg2lbs(entry['bodyweightKg']) > kg2lbs(outsideMax):
                        fileteredEntries[len(weight_classes)
                                         ]['entries'].append(entry)
                        break
        else:
            continue
    emptyKeysToRemove = []
    for index in range(len(fileteredEntries)):
        if len(fileteredEntries[index]['entries']) > 0:
            continue
        else:
            emptyKeysToRemove.append(index)
    for index in sorted(emptyKeysToRemove, reverse=True):
        fileteredEntries.pop(index)
    for index in range(len(fileteredEntries)):
        currentEntriesOrder = fileteredEntries[index]['entries']
        orderedbyPoints = sorted(currentEntriesOrder,
                                 key=lambda d: d['points'], reverse=True)
        fileteredEntries[index]['entries'] = orderedbyPoints
    return fileteredEntries


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
