import connexion
import six

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger
import requests


config = Config()


def lights_platform_get(platform):  # noqa: E501
    """Returns the code used for the lights

    Returns the health of the API  # noqa: E501

    :param platform: id of the account to return
    :type platform: int

    :rtype: AnyValue
    """
    logger.debug(type(platform))
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["order"]
    query = {"platform": platform}
    document = collection.find_one(query)

    if document is None:
        logger.info(f"Could not find document for platform: {platform}")
        raise DocumentNotFound(platform, "order")

    if "lightsCode" in document['order']:
        try:
            response = requests.get(
                config.lightsUrl + f"/{document['order']['lightsCode']}")
            jsonResponse = response.json()
            return jsonResponse
        except Exception as e:
            raise e
    else:
        return {}
