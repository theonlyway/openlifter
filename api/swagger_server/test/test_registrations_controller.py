# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server.test import BaseTestCase


class TestRegistrationsController(BaseTestCase):
    """RegistrationsController integration test stubs"""

    def test_registrations_post(self):
        """Test case for registrations_post

        Returns the current lifter
        """
        body = CurrentLifter()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/registrations',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
