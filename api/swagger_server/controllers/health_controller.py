import connexion
import six

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger, Mongodb_Client
from datetime import datetime
import json


config = Config()

def health_get():  # noqa: E501
    """Checks the health of the API

    Returns the health of the API  # noqa: E501


    :rtype: ApiHealth
    """
    client = Mongodb_Client()
    database = client[config.mongodbDatabaseName]
    collection = database["lifters"]
    healthCheck = {
        'reason': "API health check",
        'timestamp': datetime.now().isoformat()
    }
    try:
        collection.update_one(
            {'reason': "API health check"}, {'$set': healthCheck}, upsert=True)
    except Exception as e:
        raise (e)

    return {
        'databaseStatus': "ok",
        'apiStatus': "ok"
    }
