import connexion
import six
import json
import time
from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util
from swagger_server.config import Config, logger


config = Config()


def lifter_results_post(body=None):  # noqa: E501
    """Updates the lifter results

    Update the lifter results  # noqa: E501

    :param body:
    :type body: dict | bytes

    :rtype: AnyValue
    """
    database = config.mongodbClient[config.mongodbDatabaseName]
    collection = database["results"]
    if connexion.request.is_json:
        logger.debug(json.dumps(connexion.request.get_json()))
        results = connexion.request.get_json()
        resultsObj = {
            'results': results,
            'lastUpdated': time.strftime("%Y/%m/%d-%H:%M:%S", time.localtime())
        }
        collection.update_one(
            {'name': results['meetName']}, {'$set': resultsObj}, upsert=True)
        return {'status': 'ok', 'message': 'order updated'}
    return {'status': 'fail', 'message': 'No JSON object detected'}
