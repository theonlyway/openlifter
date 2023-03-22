# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.test import BaseTestCase


class TestBackupController(BaseTestCase):
    """BackupController integration test stubs"""

    def test_backup_meet_get(self):
        """Test case for backup_meet_get

        Returns a copy of the global state for a meet
        """
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/backup/{meet}'.format(meet='meet_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_backup_meet_post(self):
        """Test case for backup_meet_post

        Stores a copy of the global state for a meet
        """
        body = Object()
        response = self.client.open(
            '/theonlyway/Openlifter/1.0.0/backup/{meet}'.format(meet='meet_example'),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
