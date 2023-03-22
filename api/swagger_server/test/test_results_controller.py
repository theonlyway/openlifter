# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.test import BaseTestCase


class TestResultsController(BaseTestCase):
    """ResultsController integration test stubs"""

    def test_lifter_results_get(self):
        """Test case for lifter_results_get

        Get the results of all current lifts
        """
        query_string = [('entries_filter', 'class')]
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/lifter/results',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
