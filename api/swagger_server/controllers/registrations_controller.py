import connexion
import six

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server.models.current_lifter import CurrentLifter  # noqa: E501
from swagger_server import util


def registrations_post(body=None):  # noqa: E501
    """Returns the current lifter

    Returns the current lifter  # noqa: E501

    :param body: 
    :type body: dict | bytes

    :rtype: AnyValue
    """
    if connexion.request.is_json:
        body = CurrentLifter.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
