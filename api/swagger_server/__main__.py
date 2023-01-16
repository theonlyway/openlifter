#!/usr/bin/env python3

from swagger_server.exceptions import NotFoundException
import connexion
from flask_cors import CORS
from swagger_server import encoder
from swagger_server.config import Config, logger


def not_found_handler(error):
    return {
        "detail": str(error),
        "status": 404,
        "title": "Not Found",
    }, 404


def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Openlifter API'}, pythonic_params=True)

    # Handle NotFoundException
    app.add_error_handler(
        NotFoundException, not_found_handler)

    CORS(app.app)
    app.run(port=8080)


if __name__ == '__main__':
    config = Config()
    logger.setLevel(config.logLevel)
    main()
