import connexion
import six

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger, mongodb_connection_failure
from pymongo import errors, MongoClient
import json
import time


config = Config()


def health_post(body=None):  # noqa: E501
    """Checks the health of the API

    Returns the health of the API  # noqa: E501

    :param body:
    :type body: dict | bytes

    :rtype: ApiHealthResp
    """
    if connexion.request.is_json:
        data = connexion.request.get_json()
        try:
            database = config.mongodbClient[config.mongodbDatabaseName]
            collection = database["health"]
            healthCheck = {
                'reason': "API health check",
                'lastUpdated': time.strftime("%Y/%m/%d-%H:%M:%S", time.localtime())
            }
            collection.update_one(
                {'sub': data['sub'], 'meetName': data['meet']}, {'$set': healthCheck}, upsert=True)
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
    return {'status': 'fail', 'message': 'No JSON object detected'}
