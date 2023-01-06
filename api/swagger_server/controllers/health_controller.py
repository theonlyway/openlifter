import connexion
import six

from swagger_server.models.api_health import ApiHealth  # noqa: E501
from swagger_server import util


def health_get():  # noqa: E501
    """Checks the health of the API

    Returns the health of the API  # noqa: E501


    :rtype: ApiHealth
    """
    return 'do some magic!'
