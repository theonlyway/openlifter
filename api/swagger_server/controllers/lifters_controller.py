import connexion
import six

from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server import util


def lifter_current_get():  # noqa: E501
    """Returns the current lifter

    Returns the current lifter  # noqa: E501


    :rtype: CurrentLifter
    """
    return 'do some magic!'


def lifter_current_post(body=None):  # noqa: E501
    """Update the current lifter

    Update the current lifter  # noqa: E501

    :param body: 
    :type body: dict | bytes

    :rtype: CurrentLifter
    """
    if connexion.request.is_json:
        body = CurrentLifter.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def lifter_next_get():  # noqa: E501
    """Returns the next lifter

    Returns the current lifter  # noqa: E501


    :rtype: CurrentLifter
    """
    return 'do some magic!'


def lifter_next_post():  # noqa: E501
    """Update the next lifter

    Update the current lifter  # noqa: E501


    :rtype: CurrentLifter
    """
    return 'do some magic!'
