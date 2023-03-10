# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class CurrentLifter(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, ordered_entries: List[object]=None, attempt_one_indexed: float=None, current_entry_id: float=None, next_attempt_one_indexed: float=None, next_entry_id: float=None):  # noqa: E501
        """CurrentLifter - a model defined in Swagger

        :param ordered_entries: The ordered_entries of this CurrentLifter.  # noqa: E501
        :type ordered_entries: List[object]
        :param attempt_one_indexed: The attempt_one_indexed of this CurrentLifter.  # noqa: E501
        :type attempt_one_indexed: float
        :param current_entry_id: The current_entry_id of this CurrentLifter.  # noqa: E501
        :type current_entry_id: float
        :param next_attempt_one_indexed: The next_attempt_one_indexed of this CurrentLifter.  # noqa: E501
        :type next_attempt_one_indexed: float
        :param next_entry_id: The next_entry_id of this CurrentLifter.  # noqa: E501
        :type next_entry_id: float
        """
        self.swagger_types = {
            'ordered_entries': List[object],
            'attempt_one_indexed': float,
            'current_entry_id': float,
            'next_attempt_one_indexed': float,
            'next_entry_id': float
        }

        self.attribute_map = {
            'ordered_entries': 'orderedEntries',
            'attempt_one_indexed': 'attemptOneIndexed',
            'current_entry_id': 'currentEntryId',
            'next_attempt_one_indexed': 'nextAttemptOneIndexed',
            'next_entry_id': 'nextEntryId'
        }
        self._ordered_entries = ordered_entries
        self._attempt_one_indexed = attempt_one_indexed
        self._current_entry_id = current_entry_id
        self._next_attempt_one_indexed = next_attempt_one_indexed
        self._next_entry_id = next_entry_id

    @classmethod
    def from_dict(cls, dikt) -> 'CurrentLifter':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The CurrentLifter of this CurrentLifter.  # noqa: E501
        :rtype: CurrentLifter
        """
        return util.deserialize_model(dikt, cls)

    @property
    def ordered_entries(self) -> List[object]:
        """Gets the ordered_entries of this CurrentLifter.


        :return: The ordered_entries of this CurrentLifter.
        :rtype: List[object]
        """
        return self._ordered_entries

    @ordered_entries.setter
    def ordered_entries(self, ordered_entries: List[object]):
        """Sets the ordered_entries of this CurrentLifter.


        :param ordered_entries: The ordered_entries of this CurrentLifter.
        :type ordered_entries: List[object]
        """

        self._ordered_entries = ordered_entries

    @property
    def attempt_one_indexed(self) -> float:
        """Gets the attempt_one_indexed of this CurrentLifter.


        :return: The attempt_one_indexed of this CurrentLifter.
        :rtype: float
        """
        return self._attempt_one_indexed

    @attempt_one_indexed.setter
    def attempt_one_indexed(self, attempt_one_indexed: float):
        """Sets the attempt_one_indexed of this CurrentLifter.


        :param attempt_one_indexed: The attempt_one_indexed of this CurrentLifter.
        :type attempt_one_indexed: float
        """

        self._attempt_one_indexed = attempt_one_indexed

    @property
    def current_entry_id(self) -> float:
        """Gets the current_entry_id of this CurrentLifter.


        :return: The current_entry_id of this CurrentLifter.
        :rtype: float
        """
        return self._current_entry_id

    @current_entry_id.setter
    def current_entry_id(self, current_entry_id: float):
        """Sets the current_entry_id of this CurrentLifter.


        :param current_entry_id: The current_entry_id of this CurrentLifter.
        :type current_entry_id: float
        """

        self._current_entry_id = current_entry_id

    @property
    def next_attempt_one_indexed(self) -> float:
        """Gets the next_attempt_one_indexed of this CurrentLifter.


        :return: The next_attempt_one_indexed of this CurrentLifter.
        :rtype: float
        """
        return self._next_attempt_one_indexed

    @next_attempt_one_indexed.setter
    def next_attempt_one_indexed(self, next_attempt_one_indexed: float):
        """Sets the next_attempt_one_indexed of this CurrentLifter.


        :param next_attempt_one_indexed: The next_attempt_one_indexed of this CurrentLifter.
        :type next_attempt_one_indexed: float
        """

        self._next_attempt_one_indexed = next_attempt_one_indexed

    @property
    def next_entry_id(self) -> float:
        """Gets the next_entry_id of this CurrentLifter.


        :return: The next_entry_id of this CurrentLifter.
        :rtype: float
        """
        return self._next_entry_id

    @next_entry_id.setter
    def next_entry_id(self, next_entry_id: float):
        """Sets the next_entry_id of this CurrentLifter.


        :param next_entry_id: The next_entry_id of this CurrentLifter.
        :type next_entry_id: float
        """

        self._next_entry_id = next_entry_id
