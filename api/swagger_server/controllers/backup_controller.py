import time
import connexion
import six
import json
from swagger_server.exceptions import DocumentNotFound

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger

config = Config()


def backup_meet_get(meet):  # noqa: E501
    """Returns a copy of the global state for a meet

    Update the current lifter  # noqa: E501

    :param meet: Meet name
    :type meet: int

    :rtype: AnyValue
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["backup"]
    query = {"id": meet}
    document = collection.find_one(query)

    if document is None:
        logger.info(f"Could not find document for meet: {meet}")
        raise DocumentNotFound(meet, "backup")
    else:
        return document['globalState']


def backup_meet_post(meet, body=None):  # noqa: E501
    """Stores a copy of the global state for a meet

    Update the current lifter  # noqa: E501

    :param meet: Meet name
    :type meet: int
    :param body:
    :type body: dict | bytes

    :rtype: AnyValue
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["backup"]
    if connexion.request.is_json:
        data = connexion.request.get_json()  # noqa: E501
        logger.debug(json.dumps(connexion.request.get_json()))
        state = {
            'id': meet,
            'lastUpdated': time.strftime("%Y/%m/%d-%H:%M:%S", time.localtime()),
            'globalState': data
        }
        collection.update_one(
            {'id': meet}, {'$set': state}, upsert=True)
        return {'status': 'ok', 'message': 'state backed up'}
    return {'status': 'fail', 'message': 'No JSON object detected'}
