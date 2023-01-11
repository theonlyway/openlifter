import connexion
import six

from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger
import json

config = Config()


def registrations_put(body=None):  # noqa: E501
    """Returns the current lifter

    Returns the current lifter  # noqa: E501

    :param body:
    :type body: dict | bytes

    :rtype: CurrentLifter
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["registrations"]
    if connexion.request.is_json:
        logger.debug(json.dumps(connexion.request.get_json()))
        registrations = connexion.request.get_json()
        logger.info(f"{len(registrations)} registrations")
        i = 1
        for registration in registrations:
            logger.debug(
                f"Importing registration for id: {registration['id']} - {i} out of {len(registrations)}")
            collection.update_one(
                {'id': registration['id']}, {'$set': registration}, upsert=True)
            i = i + 1
    return 'do some magic!'
