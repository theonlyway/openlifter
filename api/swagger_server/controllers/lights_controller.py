import connexion
import six

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util


def lights_platform_get(platform):  # noqa: E501
    """Returns the code used for the lights

    Returns the health of the API  # noqa: E501

    :param platform: id of the account to return
    :type platform: int

    :rtype: AnyValue
    """
    return 'do some magic!'
