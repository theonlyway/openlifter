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

import { RecordsState, RegistrationState, MeetState } from "../../types/stateTypes";
import {
  Sex,
  Equipment,
  RecordLift,
  RecordType,
  Entry,
  Language,
  LiftingRecord,
  PotentialLiftingRecord,
} from "../../types/dataTypes";
import { calculateRecordKey, upsertRecord } from "../../reducers/recordsReducer";
import {
  getFinalTotalKg,
  getBest3SquatKg,
  getBest3BenchKg,
  getBest3DeadliftKg,
  getWeightClassForEntry,
  getAttemptWeight,
} from "../entry";
import { checkExhausted } from "../../types/utils";

// Determines if the attempt would break the current record in the state.
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

export function getRecordTypeForEntry(entry: Readonly<Entry>): RecordType {
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

// Determines if the attempt is higher then any other successful attempt for the record type
// This is used to determine if we should display the record attempt notification
// NOTE: Does not consider if the entry is eligible to break records. This is useful so we can display official/unoffocial attempt info
// NOTE: This assume that the RecordState being passed in is the most up to date version.
// - Ensure you call getUpdatedState first.
export function isRecordAttempt(
  updatedRecordState: RecordsState,
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

  // If they have no divisions, it cannot be a record attempt
  if (entry.divisions.length === 0) {
    return false;
  }

  // Work out if they're competing in a full power event, or single lift, wrt to records
  const recordType = getRecordTypeForEntry(entry);

  // Calculate the weight for the type of record requested
  let weight: number;
  if (recordLift === "Total") {
    // Total records only get announced during deadlifts, take the sum of the best S + B and the current attempted deadlift
    weight = getBest3SquatKg(entry) + getBest3BenchKg(entry) + getAttemptWeight(entry, "D", attemptOneIndexed);
  } else {
    weight = getAttemptWeight(entry, recordLift, attemptOneIndexed);
  }

  const potentialRecord: PotentialLiftingRecord = {
    division: entry.divisions[0],
    sex: entry.sex,
    weightClass,
    equipment: entry.equipment,
    recordLift,
    recordType,
    weight,
  };

  if (wouldBreakConfirmedRecord(updatedRecordState, potentialRecord)) {
    // Check to see if they've already bombed out. This prevents falsely advertising a bench/deadlift record if the participant has bombed out.
    // This assumes normal SBD order of lifts. If things are done out of order, the official records will still end up correct, but the on-screen notices won't work
    if (recordType === "FullPower") {
      // Cannot set a bench, deadlift or total record if you've bombed on squats
      if (recordLift !== "S" && getBest3SquatKg(entry) === 0) {
        return false;
      }

      // Cannot set a deadlift or total record if you've bombed on bench.
      if ((recordLift === "D" || recordLift === "Total") && getBest3BenchKg(entry) === 0) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

function addPotentialRecordIfRelevant(
  event: RecordLift,
  potentialRecords: LiftingRecord[],
  basePotentialRecord: {
    date: string;
    fullName: string;
    location: string;
    division: string;
    equipment: Equipment;
    recordType: RecordType;
    sex: Sex;
    weightClass: string;
  },
  entry: Readonly<Entry>
) {
  if (event === "Total" || (entry.events.length > 0 && entry.events[0].indexOf(event) !== -1)) {
    const weightLifted = getWeightForUnconfirmedRecord(event, entry);
    // Ensure they've actually lifted something in this event
    if (weightLifted > 0) {
      potentialRecords.push({
        ...basePotentialRecord,
        recordLift: event,
        weight: weightLifted,
      });
    }
  }
}

// Go over every entry & all their lifts and see if they break any records.
// If they do, update the records state with the new values
// Finally, return the updated state of the records.
// This is used to view the current pending records, and to confirm them prior to export
export function getUpdatedRecordState(
  initialRecordState: RecordsState,
  meet: MeetState,
  registrationState: RegistrationState,
  language: Language
): RecordsState {
  let newRecordState: RecordsState = { ...initialRecordState };
  registrationState.entries.forEach((entry) => {
    const weightClass = getWeightClassForEntry(
      entry,
      meet.weightClassesKgMen,
      meet.weightClassesKgWomen,
      meet.weightClassesKgMx,
      language
    );

    const recordType: RecordType = getRecordTypeForEntry(entry);

    // Can only set a record in a fullpower meet if you've set a total, or are on track to set one
    const canSetRecords = entry.canBreakRecords && (recordType !== "FullPower" || getFinalTotalKg(entry) > 0);

    if (canSetRecords && entry.divisions.length > 0) {
      const potentialRecords: LiftingRecord[] = [];
      const basePotentialRecord = {
        date: meet.date,
        fullName: entry.name,
        location: meet.name,
        division: entry.divisions[0],
        equipment: entry.equipment,
        recordType: recordType,
        sex: entry.sex,
        weightClass,
      };

      // Iterate through the various events and create a potential record if they've lifted in them
      addPotentialRecordIfRelevant("S", potentialRecords, basePotentialRecord, entry);
      addPotentialRecordIfRelevant("B", potentialRecords, basePotentialRecord, entry);
      addPotentialRecordIfRelevant("D", potentialRecords, basePotentialRecord, entry);
      if (recordType === "FullPower") {
        addPotentialRecordIfRelevant("Total", potentialRecords, basePotentialRecord, entry);
      }

      // This is where any custom logic for cross division/equipment/record type logic would go

      // For all potential records, check if they break the existing imported record. If so, update the state with them
      // NOTE: This should be expanded to consider who achieved the record first.
      // To do that we probably need to do a two pass loop, firstly identifying lifts which break existing records and adding them to a list.
      // Then looping over the list and sorting out ties based on who achieved it first.
      // For now, I can just live with this limitation and sort it out later
      potentialRecords.forEach((potentialRecord) => {
        if (wouldBreakConfirmedRecord(newRecordState, potentialRecord)) {
          newRecordState = upsertRecord(potentialRecord, newRecordState);
        }
      });
    }
  });

  return newRecordState;
}

export interface RecordCategory {
  sex: Sex;
  division: string;
  weightClass: string;
  equipment: Equipment;
}

export interface RecordCategoryGrouping {
  category: RecordCategory;
  records: LiftingRecord[];
}

function makeCategory(record: LiftingRecord): RecordCategory {
  const category: RecordCategory = {
    sex: record.sex,
    division: record.division,
    weightClass: record.weightClass,
    equipment: record.equipment,
  };
  return category;
}

function makeKey(category: RecordCategory): string {
  return `${category.sex}-${category.division}-${category.weightClass}-${category.equipment}`;
}

function getLiftSortOrder(lift: RecordLift): number {
  if (lift === "S") return 0;
  if (lift === "B") return 1;
  if (lift === "D") return 2;
  if (lift === "Total") return 3;
  checkExhausted(lift);
  return -1;
}

function getSexSortOrder(sex: Sex): number {
  if (sex === "M") return 0;
  if (sex === "F") return 1;
  if (sex === "Mx") return 2;
  checkExhausted(sex);
  return -1;
}

function getRecordTypeSortOrder(recordType: RecordType): number {
  if (recordType === "FullPower") return 0;
  if (recordType === "SingleLift") return 1;
  checkExhausted(recordType);
  return -1;
}

function getEquipmentSortOrder(equipment: Equipment): number {
  if (equipment === "Bare") return 0;
  if (equipment === "Sleeves") return 1;
  if (equipment === "Wraps") return 2;
  if (equipment === "Single-ply") return 3;
  if (equipment === "Multi-ply") return 4;
  if (equipment === "Unlimited") return 5;
  checkExhausted(equipment);
  return -1;
}

function getWeightClassSortOrder(weightClassString: string): number {
  const isSHW = weightClassString.endsWith("+");
  if (isSHW) {
    return Number.POSITIVE_INFINITY;
  }

  const asNumber = Number(weightClassString.replace("+", ""));
  return asNumber;
}

function compareCategory(a: RecordCategory, b: RecordCategory, divisions: readonly string[]): number {
  if (a.sex !== b.sex) {
    return getSexSortOrder(a.sex) - getSexSortOrder(b.sex);
  }
  if (a.equipment !== b.equipment) {
    return getEquipmentSortOrder(a.equipment) - getEquipmentSortOrder(b.equipment);
  }
  if (a.division !== b.division) {
    return divisions.indexOf(a.division) - divisions.indexOf(b.division);
  }
  if (a.weightClass !== b.weightClass) {
    return getWeightClassSortOrder(a.weightClass) - getWeightClassSortOrder(b.weightClass);
  }

  return 0;
}

function compareRecords(a: LiftingRecord, b: LiftingRecord): number {
  if (a.recordType !== b.recordType) {
    return getRecordTypeSortOrder(a.recordType) - getRecordTypeSortOrder(b.recordType);
  }

  if (a.recordLift !== b.recordLift) {
    return getLiftSortOrder(a.recordLift) - getLiftSortOrder(b.recordLift);
  }

  return 0;
}

// Takes all records, groups them into categories and then sorts the categories. This effectively controls the order the records are rendered
export function groupAndSortRecordsIntoCategories(
  records: LiftingRecord[],
  meetState: MeetState
): RecordCategoryGrouping[] {
  // Group all records into categories of sex, division, class, equipment, recordType
  const unSortedCategories = new Map<string, LiftingRecord[]>();
  records.forEach((record) => {
    const key = makeKey(record);
    let recordsInCategory = unSortedCategories.get(key);
    if (recordsInCategory === undefined) {
      recordsInCategory = [];
      unSortedCategories.set(key, recordsInCategory);
    }
    recordsInCategory.push(record);
  });

  // Now that all categories have records, within each category sort the records based on their lift & Type (S,B,D,T order), Full Power first
  for (const records of unSortedCategories.values()) {
    records.sort((a, b) => compareRecords(a, b));
  }

  // Ditch the map. Flatten it out into an array, which we'll sort
  const categories: RecordCategoryGrouping[] = [];
  unSortedCategories.forEach((records) => {
    const category = makeCategory(records[0]);
    categories.push({
      category,
      records,
    });
  });

  // Now sort the categories
  categories.sort((a, b) => compareCategory(a.category, b.category, meetState.divisions));

  return categories;
}
