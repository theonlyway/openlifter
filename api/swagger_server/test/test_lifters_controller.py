# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server.test import BaseTestCase


class TestLiftersController(BaseTestCase):
    """LiftersController integration test stubs"""

    def test_lifter_platform_current_get(self):
        """Test case for lifter_platform_current_get

        Returns the current lifter
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/current'.format(platform='platform_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_lifter_platform_current_post(self):
        """Test case for lifter_platform_current_post

        Update the current lifter
        """
        body = CurrentLifter()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/current'.format(platform='platform_example'),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_lifter_platform_next_get(self):
        """Test case for lifter_platform_next_get

        Returns the next lifter
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/next'.format(platform='platform_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_lifter_platform_next_post(self):
        """Test case for lifter_platform_next_post

        Update the next lifter
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/{platform}/next'.format(platform='platform_example'),
            method='POST')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
