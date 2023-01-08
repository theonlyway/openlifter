import connexion
import six

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger, mongodb_connection_failure
from pymongo import errors, MongoClient
import json
from datetime import datetime


config = Config()


def health_get():  # noqa: E501
    """Checks the health of the API

    Returns the health of the API  # noqa: E501


    :rtype: ApiHealth
    """

    try:
        database = config.mongodbClient[config.mongodbDatabaseName]
        collection = database["health"]
        healthCheck = {
            'reason': "API health check",
            'timestamp': datetime.now().isoformat()
        }
        collection.update_one(
            {'reason': "API health check"}, {'$set': healthCheck}, upsert=True)
    except errors.ServerSelectionTimeoutError as e:
        logger.error(e)
        return {
            'databaseStatus': "fail",
            'apiStatus': "ok",
            'failureMessage': mongodb_connection_failure()
        }
    except Exception as e:
        logger.error(e)
        return {
            'databaseStatus': "fail",
            'apiStatus': "ok",
            'failureMessage': json.dumps(e.args[0])
        }

    return {
        'databaseStatus': "ok",
        'apiStatus': "ok"
    }
