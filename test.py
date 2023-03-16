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
    fileteredEntries = {}
    outsideMax = weight_classes[-1:][0]
    for weight_class in weight_classes:
        if in_kg is True:
            fileteredEntries.update({
                weight_class: []
            })
        else:
            fileteredEntries.update({
                kg2lbs(weight_class): []
            })
    if in_kg is True:
        outsideMaxKey = str(outsideMax) + "+"
        outsideMaxLbsKey = str(kg2lbs(outsideMax)) + "+"
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
                    if entry['bodyweightKg'] <= weight_class:
                        fileteredEntries[weight_class].append(entry)
                        break
                    elif entry['bodyweightKg'] >= outsideMax:
                        fileteredEntries[outsideMaxKey].append(entry)
                        break
                else:
                    if kg2lbs(entry['bodyweightKg']) <= weight_class:
                        fileteredEntries[kg2lbs(weight_class)].append(entry)
                        break
                    elif kg2lbs(entry['bodyweightKg']) <= kg2lbs(outsideMax):
                        fileteredEntries[outsideMaxLbsKey].append(entry)
                        break
        else:
            continue
    return fileteredEntries


def leaderboard_results(data):
    divisions = data['meetData']['divisions']
    weightClassesKgMen = data['meetData']['weightClassesKgMen']
    weightClassesKgWomen = data['meetData']['weightClassesKgWomen']
    weightClassesKgMx = data['meetData']['weightClassesKgMx']
    events = find_unique_event_combos(data['entries'])

    entriesByWeightClassesKgMen = group_entries_by_weight_class("M",
                                                                weightClassesKgMen, data['entries'], data['meetData']['inKg'])
    entriesByWeightClassesKgWomen = group_entries_by_weight_class("F",
                                                                  weightClassesKgWomen, data['entries'], data['meetData']['inKg'])
    entriesByWeightClassesKgMx = group_entries_by_weight_class("Mx",
                                                               weightClassesKgMx, data['entries'], data['meetData']['inKg'])
    pass


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
