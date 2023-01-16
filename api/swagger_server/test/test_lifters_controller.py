# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.models.lifter_order import LifterOrder  # noqa: E501
from swagger_server.models.order_response import OrderResponse  # noqa: E501
from swagger_server.test import BaseTestCase


class TestLiftersController(BaseTestCase):
    """LiftersController integration test stubs"""

    def test_lifter_platform_current_get(self):
        """Test case for lifter_platform_current_get

        Returns the current lifter
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/current'.format(platform=1.2),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_lifter_platform_next_get(self):
        """Test case for lifter_platform_next_get

        Returns the next lifter
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/next'.format(platform=1.2),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_lifter_platform_order_post(self):
        """Test case for lifter_platform_order_post

        Update the lifter order
        """
        body = LifterOrder()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/order'.format(platform=1.2),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
