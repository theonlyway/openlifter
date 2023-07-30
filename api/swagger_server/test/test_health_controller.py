# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server.models.api_health_resp import ApiHealthResp  # noqa: E501
from swagger_server.test import BaseTestCase


class TestHealthController(BaseTestCase):
    """HealthController integration test stubs"""

    def test_health_post(self):
        """Test case for health_post

        Checks the health of the API
        """
        body = ApiHealth()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/health',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
