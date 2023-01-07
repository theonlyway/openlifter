from typing import List
from connexion.exceptions import OAuthProblem
from swagger_server.config import Config, logger

"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
config = Config()


def check_api_key(api_key, required_scopes):
    logger.debug(f"API key: {api_key}")
    logger.info("Checking supplied API key")
    if api_key == config.apiKey:
        return {'x-api_key': api_key}
    else:
        logger.debug(
            f"Provided API key: {api_key} does not match: {config.apiKey}")
        raise OAuthProblem("Invalid API key")
