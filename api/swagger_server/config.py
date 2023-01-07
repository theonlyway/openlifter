from dataclasses import dataclass
import os
import logging
from pymongo import MongoClient
from datetime import datetime


logging.basicConfig(
    format='%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s')
logger = logging.getLogger()


@dataclass
class Config:
    logLevel = os.environ.get('LOG_LEVEL', "INFO")
    apiKey = os.environ.get('API_KEY')
    mongodbHost = os.environ.get('MONGODB_HOST', "localhost")
    mongodbPort = os.environ.get('MONGODB_PORT', "27017")
    mongodbUsername = os.environ.get('MONGODB_USER')
    mongodbPassword = os.environ.get('MONGODB_PASSWORD')
    mongodbDatabaseName = os.environ.get('MONGODB_DATABASE')
    mongodbConnectionString = f"mongodb://{mongodbUsername}:{mongodbPassword}@{mongodbHost}:{mongodbPort}/{mongodbDatabaseName}"


def Mongodb_Client():
    config = Config()
    try:
        client = MongoClient(config.mongodbConnectionString)
    except Exception as e:
        logger.error("Could not connect to MongoDB")
        raise (e)
    return client
