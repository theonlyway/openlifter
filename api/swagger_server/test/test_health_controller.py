# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server.test import BaseTestCase


class TestHealthController(BaseTestCase):
    """HealthController integration test stubs"""

    def test_health_get(self):
        """Test case for health_get

        Checks the health of the API
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/health',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
