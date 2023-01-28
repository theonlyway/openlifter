from swagger_server.config import Config, logger


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
