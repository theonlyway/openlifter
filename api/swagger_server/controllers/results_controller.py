import connexion
import six

from swagger_server.models.any_value import AnyValue  # noqa: E501
from swagger_server import util


def lifter_results_get(entries_filter):  # noqa: E501
    """Get the results of all current lifts

    Update the current lifter  # noqa: E501

    :param entries_filter: The number of items to skip before starting to collect the result set
    :type entries_filter: str

    :rtype: AnyValue
    """
    return 'do some magic!'
