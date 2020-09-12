// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2020 The OpenPowerlifting Project.
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

import { RecordsState, RegistrationState, MeetState } from "../types/stateTypes";
import {
  Sex,
  Equipment,
  RecordLift,
  RecordType,
  PotentialLiftingRecord,
  Entry,
  Language,
  LiftingRecord,
} from "../types/dataTypes";
import { calculateRecordKey } from "../reducers/recordsReducer";
import {
  getFinalTotalKg,
  getBest3SquatKg,
  getBest3BenchKg,
  getBest3DeadliftKg,
  getWeightClassForEntry,
  liftToAttemptFieldName,
  getProjectedTotalKg,
} from "./entry";
import { checkExhausted } from "../types/utils";

// Determines if the attempt would break the current confirmed records. Does not check if it breaks an existing unconfirmed record
// This is used so that any successful lifts higher then the current confirmed record are stored as unconfirmed records for later
export function wouldBreakConfirmedRecord(state: RecordsState, potentialRecord: PotentialLiftingRecord): boolean {
  const key = calculateRecordKey(potentialRecord);
  const confirmedRecord = state.confirmedRecords[key];
  // If there is a confirmed record for this type, return true if our attempt is larger
  if (confirmedRecord !== undefined) {
    return potentialRecord.weight > confirmedRecord.weight;
  } else {
    // Otherwise, there is no record for this class, so by definition it is a record attempt
    return true;
  }
}

function getRecordTypeForEntry(entry: Readonly<Entry>): RecordType {
  return entry.events[0] === "SBD" ? "FullPower" : "SingleLift";
}

export function getWeightForUnconfirmedRecord(recordLift: RecordLift, entry: Entry): number {
  switch (recordLift) {
    case "S":
      return getBest3SquatKg(entry);
    case "B":
      return getBest3BenchKg(entry);
    case "D":
      return getBest3DeadliftKg(entry);
    case "Total":
      return getFinalTotalKg(entry);
    default:
      checkExhausted(recordLift);
      return -1;
  }
}

// Determines if the attempt is higher then any other successful attempt for the record type.
// Considers both confirmed & unconfirmed records.
// This is used to determine if we should display the record attempt notification
export function isOfficialRecordAttempt(
  state: RecordsState,
  registrationState: RegistrationState,
  meet: MeetState,
  entry: Entry,
  recordLift: RecordLift,
  attemptOneIndexed: number,
  language: Language
): boolean {
  const weightClass = getWeightClassForEntry(
    entry,
    meet.weightClassesKgMen,
    meet.weightClassesKgWomen,
    meet.weightClassesKgMx,
    language
  );

  // Work out if they're competing in a 3 lift event, or any other event
  const recordType = getRecordTypeForEntry(entry);

  // Calculate the weight for the type of record requested
  let weight: number;
  if (recordLift === "Total") {
    weight = getProjectedTotalKg(entry);
  } else {
    const attemptWeightField = liftToAttemptFieldName(recordLift);
    weight = entry[attemptWeightField][attemptOneIndexed - 1];
  }

  const potentialRecord = {
    division: entry.divisions[0],
    sex: entry.sex,
    weightClass,
    equipment: entry.equipment,
    recordLift,
    recordType,
    weight,
  };

  if (wouldBreakConfirmedRecord(state, potentialRecord)) {
    // Check to see if they've already bombed out. This prevents falsely advertising a bench/deadlift record if the participant has bombed out.
    // This assumes normal SBD order of lifts. If things are done out of order, the official records will still end up correct, but the on-screen notices won't work
    if (recordType === "FullPower") {
      // Cannot set a bench or deadlift record if you've bombed on squats
      if ((recordLift === "B" || recordLift === "D") && getBest3SquatKg(entry) === 0) {
        return false;
      }

      // Cannot set a deadlift record if you've bombed on bench.
      if (recordLift === "D" && getBest3DeadliftKg(entry) === 0) {
        return false;
      }
    }

    // Check if anybody else has lifted the same or more
    const hasAnyoneLiftedMore = registrationState.entries.some((otherEntry) => {
      const otherEntryWeightClass = getWeightClassForEntry(
        otherEntry,
        meet.weightClassesKgMen,
        meet.weightClassesKgWomen,
        meet.weightClassesKgMx,
        language
      );

      // Is this entry competing for the same record?
      if (
        otherEntry.sex === entry.sex &&
        otherEntry.divisions[0] === entry.divisions[0] &&
        otherEntry.equipment === entry.equipment &&
        weightClass === otherEntryWeightClass &&
        getRecordTypeForEntry(otherEntry) === recordType
      ) {
        // Was their weight the same, or equal?
        return getWeightForUnconfirmedRecord(recordLift, otherEntry) >= weight;
      }

      return false;
    });

    // If we're attempting more then the confirmed record, and nobody has lifted the same or higher already, this is an official record attempt
    return !hasAnyoneLiftedMore;
  } else {
    return false;
  }

  /*
  const key = calculateRecordKey(potentialRecord);
     const unconfirmedRecordsForKey = state.unconfirmedRecords[key];
  if (unconfirmedRecordsForKey !== undefined) {
    // If every unconfirmed record is less then the attempt, its an official one. Don't check confirmed records since by definition, they will be less
    return (
      // Figure this shit out later
      unconfirmedRecordsForKey.every((record) => getWeightForUnconfirmedRecord(record) < weight) &&
      wouldBreakConfirmedRecord(state, potentialRecord)
    );
  } else {
    // No unconfirmed records, check if it beats the current confirmed record
    return wouldBreakConfirmedRecord(state, potentialRecord);
  } */
}

function addPotentialRecordIfRelevant(
  event: RecordLift,
  potentialRecords: PotentialLiftingRecord[],
  basePotentialRecord: {
    division: string;
    equipment: Equipment;
    recordType: RecordType;
    sex: Sex;
    weightClass: string;
  },
  entry: Readonly<Entry>
) {
  if (entry.events[0].indexOf(event) !== -1) {
    potentialRecords.push({
      ...basePotentialRecord,
      recordLift: event,
      weight: getWeightForUnconfirmedRecord(event, entry),
    });
  }
}

export function confirmRecords(
  recordState: RecordsState,
  meet: MeetState,
  registrationState: RegistrationState,
  language: Language,
  upsertConfirmedRecord: (
    record: LiftingRecord
  ) => void /* ,
  markRecordsAsConfirmed: (record: UnconfirmedLiftingRecord) => void,
  deleteUnconfirmedRecord: (record: UnconfirmedLiftingRecord) => void */
) {
  registrationState.entries.forEach((entry) => {
    const weightClass = getWeightClassForEntry(
      entry,
      meet.weightClassesKgMen,
      meet.weightClassesKgWomen,
      meet.weightClassesKgMx,
      language
    );

    // Todo, think about this again
    const recordType: RecordType = getRecordTypeForEntry(entry);
    const canSetRecords = entry.canBreakRecords && (recordType !== "FullPower" || getFinalTotalKg(entry) > 0);

    if (canSetRecords) {
      const potentialRecords: PotentialLiftingRecord[] = [];
      const basePotentialRecord = {
        division: entry.divisions[0],
        equipment: entry.equipment,
        recordType: recordType,
        sex: entry.sex,
        weightClass,
      };

      addPotentialRecordIfRelevant("S", potentialRecords, basePotentialRecord, entry);
      addPotentialRecordIfRelevant("B", potentialRecords, basePotentialRecord, entry);
      addPotentialRecordIfRelevant("D", potentialRecords, basePotentialRecord, entry);
      if (recordType === "FullPower") {
        addPotentialRecordIfRelevant("Total", potentialRecords, basePotentialRecord, entry);
      }

      potentialRecords.forEach((potentialRecord) => {
        if (wouldBreakConfirmedRecord(recordState, potentialRecord)) {
          const liftingRecord: LiftingRecord = {
            date: meet.date,
            fullName: entry.name,
            location: meet.name,
            division: potentialRecord.division,
            equipment: potentialRecord.equipment,
            recordLift: potentialRecord.recordLift,
            recordType: potentialRecord.recordType,
            sex: potentialRecord.sex,
            weight: potentialRecord.weight,
            weightClass: potentialRecord.weightClass,
          };
          upsertConfirmedRecord(liftingRecord);
        }
      });
    }
  });
}

/*   for (const [recordKey, unconfirmedRecords] of Object.entries(recordState.unconfirmedRecords)) {
    if (unconfirmedRecords) {
      unconfirmedRecords.forEach((unconfirmedRecord) => {
        const entry = registrationState.entries[unconfirmedRecord.entryId];
        // If they didn't get a total their record is invalid
        if (unconfirmedRecord.recordType === "FullPower" && getFinalTotalKg(entry) === 0.0) {
          deleteUnconfirmedRecord(unconfirmedRecord);
        } else {
          // Ensure the record currently beats the confirmed record.
          // We have to check this as we may have recently confirmed a higher record then when this record was initially broken
          const currentRecord = recordState.confirmedRecords[recordKey];

          // Calculate the weight this potential record is for. We do this now rather then at the time of the lift, as weights of lifts can be altered, and its tricky to track.
          const unconfirmedRecordWeight = getWeightForUnconfirmedRecord(unconfirmedRecord, entry);

          // If the current confirmed record is less then the unconfirmed record, we can confirm the new record
          if (currentRecord && currentRecord.weight < unconfirmedRecordWeight) {
            markRecordsAsConfirmed(unconfirmedRecord);
          }
        }
      });
    }
  } */

// TODO: Put this somewhere more logical?
export function mapSexToClasses(
  sex: Sex,
  weightClassesKgMen: readonly number[],
  weightClassesKgWomen: readonly number[],
  weightClassesKgMx: readonly number[]
): ReadonlyArray<number> {
  switch (sex) {
    case "M":
      return weightClassesKgMen;
    case "F":
      return weightClassesKgWomen;
    case "Mx":
      return weightClassesKgMx;
    default:
      checkExhausted(sex);
      return weightClassesKgMen;
  }
}
