# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.test import BaseTestCase


class TestLightsController(BaseTestCase):
    """LightsController integration test stubs"""

    def test_lights_platform_get(self):
        """Test case for lights_platform_get

        Returns the code used for the lights
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lights/{platform}'.format(platform=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
