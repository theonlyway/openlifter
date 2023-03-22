import connexion
import six
import json
import time
from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger
from swagger_server.controllers.helpers import leaderboard_results


config = Config()


def lifter_results_get(entries_filter):  # noqa: E501
    """Updates the lifter results

    Update the lifter results  # noqa: E501

    :param body:
    :type body: dict | bytes

    :rtype: AnyValue
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    documents = collection.find({})
    data = {
        'meetData': None,
        'entries': []
    }
    for document in documents:
        data['meetData'] = document['meetData']
        data['entries'].extend(document['order']['orderedEntries'])
    return leaderboard_results(data, entries_filter)
