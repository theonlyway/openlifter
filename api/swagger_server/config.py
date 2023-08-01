import os
import logging
from pymongo import MongoClient


logging.basicConfig(
    format='%(asctime)s,%(msecs)03d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s')
logger = logging.getLogger()

class Config:
    logLevel = os.environ.get('LOG_LEVEL', "INFO")
    apiKey = os.environ.get('API_KEY')
    mongodbHost = os.environ.get('MONGODB_HOST', "localhost")
    mongodbPort = os.environ.get('MONGODB_PORT', "27017")
    mongodbUsername = os.environ.get('MONGODB_USER')
    mongodbPassword = os.environ.get('MONGODB_PASSWORD')
    mongodbDatabaseName = os.environ.get('MONGODB_DATABASE')
    mongodbConnectionString = None
    mongodbClient = None
    lightsUrl = "https://lights.barbelltracker.com/api/meet_status"

    def __init__(self) -> None:
        if os.environ.get('MONGODB_USE_SRV', "false").lower() == 'true':
            self.mongodbConnectionString = f"mongodb+srv://{self.mongodbUsername}:{self.mongodbPassword}@{self.mongodbHost}/{self.mongodbDatabaseName}"
        else:
            self.mongodbConnectionString = f"mongodb+srv://{self.mongodbUsername}:{self.mongodbPassword}@{self.mongodbHost}:{self.mongodbPort}/{self.mongodbDatabaseName}"
        self.mongodbClient = MongoClient(self.mongodbConnectionString,
                                         serverSelectionTimeoutMS=5000, maxPoolSize=1)


def mongodb_connection_failure() -> str:
    config = Config()
    return f"Connection timeout connecting to MongoDB server: mongodb://{config.mongodbUsername}:<password_redacted>@{config.mongodbHost}:{config.mongodbPort}/{config.mongodbDatabaseName}"
