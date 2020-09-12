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

import { checkExhausted } from "../types/utils";
import {
  ImportRecordsAction,
  UpsertConfirmedRecordAction,
  DeleteRecordAction,
  InsertUnconfirmedRecordAction,
  MarkRecordAsConfirmedAction,
  DeleteUncofirmedRecordAction,
  MarkLiftAction,
} from "../types/actionTypes";
import { RecordsState } from "../types/stateTypes";
import { LiftingRecord, UnconfirmedLiftingRecord, RecordType, RecordKeyComponents } from "../types/dataTypes";
import { wouldBreakConfirmedRecord } from "../logic/records";
import { liftToAttemptFieldName, liftToStatusFieldName, getFinalTotalKg } from "../logic/entry";

type Action =
  | ImportRecordsAction
  | UpsertConfirmedRecordAction
  | DeleteRecordAction
  | InsertUnconfirmedRecordAction
  | MarkRecordAsConfirmedAction
  | DeleteUncofirmedRecordAction/*
  | MarkLiftAction */;

const initialState: RecordsState = {
  confirmedRecords: {},
  unconfirmedRecords: {},
};

export function calculateRecordKey(record: RecordKeyComponents): string {
  return `${record.division}|${record.sex}|${record.weightClass}|${record.equipment}|${record.recordLift}|${record.recordType}`;
}

/* // Comapres to records for equality. We cannot simply compare by recordKey, as recordKeys do not consider name, weight, location, date etc.
function areRecordsEqual(recordA: UnconfirmedLiftingRecord, recordB: UnconfirmedLiftingRecord): boolean {
  return (
    recordA.entryId === recordB.entryId &&
    recordA.date === recordB.date &&
    recordA.division === recordB.division &&
    recordA.equipment === recordB.equipment &&
    recordA.fullName === recordB.fullName &&
    recordA.location === recordB.location &&
    recordA.recordLift === recordB.recordLift &&
    recordA.recordType === recordB.recordType &&
    recordA.sex === recordB.sex &&
    recordA.weight === recordB.weight &&
    recordA.weightClass === recordB.weightClass
  );
}

function deleteUnconfirmedRecord(
  record: UnconfirmedLiftingRecord,
  state: RecordsState
): { [recordKey: string]: UnconfirmedLiftingRecord[] | undefined } {
  const recordKey = calculateRecordKey(record);
  const newLookup = { ...state.unconfirmedRecords };
  const recordsForKey = newLookup[recordKey] || [];
  const newRecordsForKey = recordsForKey.filter((record) => !areRecordsEqual(record, record));
  // No unconfirmed records left, clean up the key and return
  if (newRecordsForKey.length === 0) {
    delete newLookup[recordKey];
  } else {
    newLookup[recordKey] = newRecordsForKey;
  }
  return newLookup;
}

function insertUnconfirmedRecord(record: UnconfirmedLiftingRecord, state: RecordsState): RecordsState {
  const recordKey = calculateRecordKey(record);
  const newLookup = { ...state.unconfirmedRecords };
  const recordsForKey = newLookup[recordKey];
  let newRecordsForKey: UnconfirmedLiftingRecord[] | null = null;

  // If there are no unconfirmed records for this record-key, create a new list
  if (!recordsForKey) {
    newRecordsForKey = [record];
  } else {
    // Otherwise, clone the list and add the new unconfirmed record
    newRecordsForKey = [...recordsForKey, record];
  }
  newLookup[recordKey] = newRecordsForKey;

  return {
    ...state,
    unconfirmedRecords: newLookup,
  };
} */

export default (state: RecordsState = initialState, action: Action): RecordsState => {
  switch (action.type) {
    case "IMPORT_RECORDS":
      const recordLookup: { [recordKey: string]: LiftingRecord } = {};
      action.records.forEach((record) => {
        recordLookup[calculateRecordKey(record)] = record;
      });

      return {
        confirmedRecords: recordLookup,
        unconfirmedRecords: {},
      };

    case "UPSERT_CONFIRMED_RECORD": {
      const recordKey = calculateRecordKey(action.record);
      const newLookup = { ...state.confirmedRecords };
      newLookup[recordKey] = action.record;

      return {
        ...state,
        confirmedRecords: newLookup,
      };
    }

    case "DELETE_CONFIRMED_RECORD": {
      const recordKey = calculateRecordKey(action.record);
      const newLookup = { ...state.confirmedRecords };
      delete newLookup[recordKey];

      return {
        ...state,
        confirmedRecords: newLookup,
      };
    }

/*     case "MARK_LIFT": {
      let updatedState = { ...state };
      const entry = action.entry;
      // TODO: What does being in multiple divisions even mean for records? Just take the first one for now
      const division = action.entry.divisions[0];
      // TODO: what does it mean for an entrant to be in multiple events...? Just take the first one.
      const recordType: RecordType = entry.events[0] === "SBD" ? "FullPower" : "SingleLift";
      const attemptWeightField = liftToAttemptFieldName(action.lift);
      const attemptStatusField = liftToStatusFieldName(action.lift);
      const currentStatus = entry[attemptStatusField][action.attemptOneIndexed - 1];

      // Create a potential record for this lift for storing if its a record
      const potentialRecordForLift: UnconfirmedLiftingRecord = {
        fullName: entry.name,
        weight: entry[attemptWeightField][action.attemptOneIndexed - 1],
        date: "123",
        location: action.meetName,
        division,
        sex: entry.sex,
        weightClass: action.weightClass,
        equipment: entry.equipment,
        recordLift: action.lift,
        recordType,
        entryId: entry.id,
      };

      /*       // If this is a fullpower event, create a potential total record
      const potentialTotalRecord: UnconfirmedLiftingRecord | null =
        recordType === "FullPower"
          ? {
              // Copy the record lift, but change the weight & type to the lifters total
              ...potentialRecordForLift,
              recordLift: "Total",
              weight: getFinalTotalKg(entry),
            }
          : null; */

      // If we've already taken this lift and we were successful, but now its been marked as failed, we need to remove any unconfirmed records
      // This happens if the user incorrectly marks a lift as successful and later alters it
      if (currentStatus === 1 && !action.success) {
        updatedState = {
          ...updatedState,
          unconfirmedRecords: deleteUnconfirmedRecord(potentialRecordForLift, updatedState),
        };
      }

      if (action.success) {
        // successful lift - check if it breaks any records
        if (wouldBreakConfirmedRecord(potentialRecordForLift, state)) {
          updatedState = insertUnconfirmedRecord(potentialRecordForLift, updatedState);
        }
      }

      return updatedState;
    }
 */
    case "DELETE_UNCONFIRMED_RECORD": {
      const newLookup = deleteUnconfirmedRecord(action.record, state);

      return {
        ...state,
        unconfirmedRecords: newLookup,
      };
    }

    case "MARK_RECORD_AS_CONFIRMED": {
      // Delete the record from unconfirmed list, then add it to the confirmed
      const newUnconfirmedRecords = deleteUnconfirmedRecord(action.record, state);
      const recordKey = calculateRecordKey(action.record);
      const newConfirmedRecords = { ...state.confirmedRecords };
      newConfirmedRecords[recordKey] = action.record;

      return {
        ...state,
        unconfirmedRecords: newUnconfirmedRecords,
        confirmedRecords: newConfirmedRecords,
      };
    }

    default:
      checkExhausted(action);
      return state;
  }
};
