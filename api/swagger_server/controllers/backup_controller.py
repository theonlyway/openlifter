import connexion
import six

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util


def backup_meet_get(meet):  # noqa: E501
    """Returns a copy of the global state for a meet

    Update the current lifter  # noqa: E501

    :param meet: Meet name
    :type meet: int

    :rtype: AnyValue
    """
    return 'do some magic!'


def backup_meet_post(meet, body=None):  # noqa: E501
    """Stores a copy of the global state for a meet

    Update the current lifter  # noqa: E501

    :param meet: Meet name
    :type meet: int
    :param body: 
    :type body: dict | bytes

    :rtype: AnyValue
    """
    if connexion.request.is_json:
        body = Object.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
