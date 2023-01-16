import connexion
import six

from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger
import json
import time


config = Config()


def lifter_platform_current_get(platform):  # noqa: E501
    """Returns the current lifter

    Returns the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str

    :rtype: CurrentLifter
    """
    return 'do some magic!'


def lifter_platform_next_get(platform):  # noqa: E501
    """Returns the next lifter

    Returns the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str

    :rtype: CurrentLifter
    """
    return 'do some magic!'


def lifter_platform_order_post(platform, body=None):  # noqa: E501
    """Update the lifter order

    Update the current lifter  # noqa: E501

    :param platform: id of the account to return
    :type platform: str
    :param body:
    :type body: dict | bytes

    :rtype: CurrentLifter
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    if connexion.request.is_json:
        logger.debug(json.dumps(connexion.request.get_json()))
        order = {
            'platform': platform,
            'order': connexion.request.get_json(),
            'lastUpdated': time.strftime("%Y/%m/%d-%H:%M:%S", time.localtime())
        }
        collection.update_one(
            {'platform': platform}, {'$set': order}, upsert=True)
        return {'status': 'ok', 'message': 'order updated'}
    return {'status': 'fail', 'message': 'No JSON object detected'}
