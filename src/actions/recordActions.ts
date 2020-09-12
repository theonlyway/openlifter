// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import {
  ImportRecordsAction,
  DeleteRecordAction,
  UpsertConfirmedRecordAction,
  MarkRecordAsConfirmedAction,
  DeleteUncofirmedRecordAction,
} from "../types/actionTypes";
import { LiftingRecord, UnconfirmedLiftingRecord } from "../types/dataTypes";

export function importRecords(records: LiftingRecord[]): ImportRecordsAction {
  return {
    type: "IMPORT_RECORDS",
    records,
  };
}

export function deleteConfirmedRecord(record: LiftingRecord): DeleteRecordAction {
  return {
    type: "DELETE_CONFIRMED_RECORD",
    record,
  };
}

export function upsertConfirmedRecord(record: LiftingRecord): UpsertConfirmedRecordAction {
  return {
    type: "UPSERT_CONFIRMED_RECORD",
    record,
  };
}

export function markRecordAsConfirmed(record: UnconfirmedLiftingRecord): MarkRecordAsConfirmedAction {
  return {
    type: "MARK_RECORD_AS_CONFIRMED",
    record,
  };
}

export function deleteUnconfirmedRecord(record: UnconfirmedLiftingRecord): DeleteUncofirmedRecordAction {
  return {
    type: "DELETE_UNCONFIRMED_RECORD",
    record,
  };
}
