# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.test import BaseTestCase


class TestResultsController(BaseTestCase):
    """ResultsController integration test stubs"""

    def test_lifter_results_post(self):
        """Test case for lifter_results_post

        Updates the lifter results
        """
        body = Object()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/results',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
