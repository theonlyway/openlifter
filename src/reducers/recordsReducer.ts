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

import { ImportRecordsAction } from "../types/actionTypes";
import { RecordsState } from "../types/stateTypes";
import { LiftingRecord, RecordKeyComponents } from "../types/dataTypes";

type Action = ImportRecordsAction;

const initialState: RecordsState = {
  confirmedRecords: {},
};

export function calculateRecordKey(record: RecordKeyComponents): string {
  return `${record.division}|${record.sex}|${record.weightClass}|${record.equipment}|${record.recordLift}|${record.recordType}`;
}

// Add or replace a record in the state and return the updated state. Used for unifying the imported records with new records in the meet
export function upsertRecord(record: LiftingRecord, state: RecordsState): RecordsState {
  const recordKey = calculateRecordKey(record);
  const newLookup = { ...state.confirmedRecords };
  newLookup[recordKey] = record;

  return {
    ...state,
    confirmedRecords: newLookup,
  };
}

export default (state: RecordsState = initialState, action: Action): RecordsState => {
  switch (action.type) {
    case "IMPORT_RECORDS": {
      const recordLookup: { [recordKey: string]: LiftingRecord } = {};
      action.records.forEach((record) => {
        recordLookup[calculateRecordKey(record)] = record;
      });

      return { ...state, confirmedRecords: recordLookup };
    }
  }

  return state;
};
