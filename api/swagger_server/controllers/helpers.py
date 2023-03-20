from swagger_server.config import Config, logger
import json


def calculate_max_lifts(data):
    logger.info("Calculating max successful lift values")
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


def kg2lbs(kg):
    return round(kg * 2.20462262, 2)


def lbs2kgs(kg):
    return round(kg / 2.20462262, 2)


def find_unique_event_combos(entries):
    events = []
    for entry in entries:
        events.extend(entry['events'])
    return list(set(events))


def group_entries(sex, weight_classes, entries, in_kg, entries_filter):
    if entries_filter == "class":
        return group_entries_by_weight_class(sex, weight_classes, entries, in_kg)
    elif entries_filter == "points":
        return group_entries_by_total_points(sex, weight_classes, entries, in_kg)


def group_entries_by_total_points(sex, weight_classes, entries, in_kg):
    logger.info(f"Grouping entries by total points for: {sex}")
    if len(weight_classes) == 0:
        return None
    fileteredEntries = []
    outsideMax = weight_classes[-1:][0]
    outsideMaxKey = str(outsideMax) + "+"
    outsideMaxLbsKey = str(kg2lbs(outsideMax)) + "+"

    for entry in entries:
        logger.debug(entry)
        if entry['sex'] == sex:
            for index in range(len(weight_classes)):
                logger.info(
                    f"Checking if entry id: {entry['id']} belongs in class: {weight_classes[index]}")
                if in_kg is True:
                    if entry['bodyweightKg'] <= weight_classes[index]:
                        logger.info(
                            f"Body weight: {entry['bodyweightKg']} within class: {weight_classes[index]}")
                        entry["weightClass"] = weight_classes[index]
                        fileteredEntries.append(entry)
                        break
                    elif entry['bodyweightKg'] > outsideMax:
                        logger.info(
                            f"Body weight: {entry['bodyweightKg']} outside of maximum class assigned to: {outsideMaxKey}")
                        entry["weightClass"] = outsideMaxKey
                        fileteredEntries.append(entry)
                        break
                else:
                    if kg2lbs(entry['bodyweightKg']) <= kg2lbs(weight_classes[index]):
                        logger.info(
                            f"Body weight: {kg2lbs(entry['bodyweightKg'])} within class: {kg2lbs(weight_classes[index])}")
                        entry["weightClass"] = kg2lbs(weight_classes[index])
                        fileteredEntries.append(entry)
                        break
                    elif kg2lbs(entry['bodyweightKg']) > kg2lbs(outsideMax):
                        logger.info(
                            f"Body weight: {kg2lbs(entry['bodyweightKg'])} outside of maximum class assigned to: {outsideMaxLbsKey}")
                        entry["weightClass"] = outsideMaxLbsKey
                        fileteredEntries.append(entry)
                        break
        else:
            continue

    logger.info("Ordering entries by points")
    orderedbyPoints = sorted(fileteredEntries,
                             key=lambda d: d['points'], reverse=True)
    return orderedbyPoints


def group_entries_by_weight_class(sex, weight_classes, entries, in_kg):
    logger.info(f"Grouping entries by class for: {sex}")
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
        logger.debug(entry)
        if entry['sex'] == sex:
            for index in range(len(weight_classes)):
                logger.info(
                    f"Checking if entry id: {entry['id']} belongs in class: {weight_classes[index]}")
                if in_kg is True:
                    if entry['bodyweightKg'] <= weight_classes[index]:
                        logger.info(
                            f"Body weight: {entry['bodyweightKg']} within class: {weight_classes[index]}")
                        fileteredEntries[index]['entries'].append(entry)
                        break
                    elif entry['bodyweightKg'] > outsideMax:
                        logger.info(
                            f"Body weight: {entry['bodyweightKg']} outside of maximum class assigned to: {outsideMaxKey}")
                        fileteredEntries[len(weight_classes)
                                         ]['entries'].append(entry)
                        break
                else:
                    if kg2lbs(entry['bodyweightKg']) <= kg2lbs(weight_classes[index]):
                        logger.info(
                            f"Body weight: {kg2lbs(entry['bodyweightKg'])} within class: {kg2lbs(weight_classes[index])}")
                        fileteredEntries[index]['entries'].append(entry)
                        break
                    elif kg2lbs(entry['bodyweightKg']) > kg2lbs(outsideMax):
                        logger.info(
                            f"Body weight: {kg2lbs(entry['bodyweightKg'])} outside of maximum class assigned to: {outsideMaxLbsKey}")
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
        logger.info(
            f"Removing index: {index} due to it not having any entries")
        fileteredEntries.pop(index)
    for index in range(len(fileteredEntries)):
        logger.info(
            f"Ordering entries for: {fileteredEntries[index]['weightClass']}")
        currentEntriesOrder = fileteredEntries[index]['entries']
        orderedbyPoints = sorted(currentEntriesOrder,
                                 key=lambda d: d['points'], reverse=True)
        fileteredEntries[index]['entries'] = orderedbyPoints
    return fileteredEntries


def leaderboard_results(data, entries_filter):
    weightClassesKgMen = data['meetData']['weightClassesKgMen']
    weightClassesKgWomen = data['meetData']['weightClassesKgWomen']
    weightClassesKgMx = data['meetData']['weightClassesKgMx']

    entriesByWeightClassesKgMen = group_entries("M",
                                                weightClassesKgMen, data['entries'], data['meetData']['inKg'], entries_filter)
    entriesByWeightClassesKgWomen = group_entries("F",
                                                  weightClassesKgWomen, data['entries'], data['meetData']['inKg'], entries_filter)
    entriesByWeightClassesKgMx = group_entries("Mx",
                                               weightClassesKgMx, data['entries'], data['meetData']['inKg'], entries_filter)

    return {
        'male': entriesByWeightClassesKgMen,
        'female': entriesByWeightClassesKgWomen,
        'mx': entriesByWeightClassesKgMx
    }
