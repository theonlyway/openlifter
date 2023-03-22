from swagger_server.exceptions import DocumentNotFound
import connexion
import six

from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger
import json
import time
from swagger_server.controllers.helpers import calculate_max_lifts


config = Config()


def lifter_platform_current_get(platform):  # noqa: E501
    """Returns the current lifter

    Returns the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str

    :rtype: CurrentLifter
    """
    logger.debug(type(platform))
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    query = {"platform": platform}
    document = collection.find_one(query)
    currentEntryId = document['order']['currentEntryId']
    currentAttemptNumber = document['order']['attemptOneIndexed']
    platformDetails = document['order']['platformDetails']

    if document is None:
        logger.info(f"Could not find document for platform: {platform}")
        raise DocumentNotFound(platform, "order")
    else:
        if currentEntryId is not None:
            for order in document['order']['orderedEntries']:
                if order['id'] == currentEntryId:
                    logger.info(
                        f"Found entry details for id: {currentEntryId}")
                    return {
                        'platformDetails': platformDetails,
                        'attempt': currentAttemptNumber,
                        'entry': order,
                        'maxLift': calculate_max_lifts(order)
                    }
        elif currentEntryId is None:
            return {
                'platformDetails': platformDetails,
                'attempt': currentAttemptNumber,
                'entry': document['order']['orderedEntries'][-1],
                'maxLift': calculate_max_lifts(document['order']['orderedEntries'][-1])
            }
        else:
            raise DocumentNotFound(platform, "order")

def lifter_platform_next_get(platform):  # noqa: E501
    """Returns the next lifter

    Returns the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str

    :rtype: CurrentLifter
    """
    logger.debug(type(platform))
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    query = {"platform": platform}
    document = collection.find_one(query)
    nextEntryId = document['order']['nextEntryId']
    nextAttemptNumber = document['order']['nextAttemptOneIndexed']
    platformDetails = document['order']['platformDetails']

    if document is None:
        logger.info(f"Could not find document for platform: {platform}")
        raise DocumentNotFound(platform, "order")
    else:
        if nextEntryId is not None:
            for order in document['order']['orderedEntries']:
                if order['id'] == nextEntryId:
                    logger.info(f"Found entry details for id: {nextEntryId}")
                    return {
                        'platformDetails': platformDetails,
                        'attempt': nextAttemptNumber,
                        'entry': order
                    }
        elif nextEntryId is None:
            return {
                'platformDetails': platformDetails,
                'attempt': 3,
                'entry': document['order']['orderedEntries'][-1]
            }
        else:
            raise DocumentNotFound(platform, "order")


def lifter_platform_order_post(platform, body=None):  # noqa: E501
    """Update the lifter order

    Update the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str
    :param body:
    :type body: dict | bytes

    :rtype: CurrentLifter
    """
    logger.debug(type(platform))
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    if connexion.request.is_json:
        data = connexion.request.get_json()
        logger.debug(json.dumps(connexion.request.get_json()))
        order = {
            'platform': platform,
            'meetData': data['meetData'],
            'lightsCode': data['lightsCode'],
            'order': data['order'],
            'lastUpdated': time.strftime("%Y/%m/%d-%H:%M:%S", time.localtime())
        }
        collection.update_one(
            {'platform': platform}, {'$set': order}, upsert=True)
        return {'status': 'ok', 'message': 'order updated'}
    return {'status': 'fail', 'message': 'No JSON object detected'}
