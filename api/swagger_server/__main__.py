#!/usr/bin/env python3

import connexion
from flask_cors import CORS
from swagger_server import encoder
from swagger_server.config import Config, logger

def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Openlifter API'}, pythonic_params=True)
    CORS(app.app)
    app.run(port=8080)


if __name__ == '__main__':
    config = Config()
    logger.setLevel(config.logLevel)
    main()
