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

// Exports data to a CSV format easily importable by OpenPowerlifting.

import { csvDate, csvString, Csv } from "./csv";
import { getFinalResults } from "../divisionPlace";
import { wtclsStrKg2Lbs } from "../../reducers/meetReducer";
import {
  getAge,
  getBest3SquatKg,
  getBest3BenchKg,
  getBest3DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted,
  MAX_ATTEMPTS
} from "../entry";
import { displayWeight, kg2lbs } from "../units";

import { Category, CategoryResults } from "../divisionPlace";
import { Entry, Equipment } from "../../types/dataTypes";
import { GlobalState, MeetState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";

const makeMeetCsv = (meet: MeetState): Csv => {
  const csv = new Csv();
  csv.fieldnames = ["Federation", "Date", "MeetCountry", "MeetState", "MeetTown", "MeetName", "Formula"];

  const row: Array<string> = [
    csvString(meet.federation),
    csvDate(meet.date),
    csvString(meet.country),
    csvString(meet.state),
    csvString(meet.city),
    csvString(meet.name),
    csvString(meet.formula)
  ];
  csv.rows = [row];

  // An optional RuleSet column may be provided.
  if (meet.combineSleevesAndWraps === true) {
    csv.fieldnames.push("RuleSet");
    csv.rows[0].push("CombineRawAndWraps");
  }

  return csv;
};

const standardizeEquipment = (eq: Equipment): string => {
  switch (eq) {
    case "Bare":
      return "Raw";
    case "Sleeves":
      return "Raw";
    case "Wraps":
      return "Wraps";
    case "Single-ply":
      return "Single-ply";
    case "Multi-ply":
      return "Multi-ply";
    default:
      checkExhausted(eq);
      return "Raw";
  }
};

const addEntriesRow = (
  csv: Csv,
  category: Category,
  unit: string,
  attemptsInKg: boolean,
  bodyweightsInKg: boolean,
  meetDate: string,
  entry: Entry,
  index: number
) => {
  const finalEventTotalKg = getFinalEventTotalKg(entry, category.event);

  // Helper functions to keep things one-liners below. Handles Kg/Lbs conversion.
  const convertKg = (kg: number, unitInKg: boolean): string => {
    return displayWeight(unitInKg ? kg : kg2lbs(kg));
  };
  const wtcls = (cls: string): string => {
    return bodyweightsInKg ? cls : wtclsStrKg2Lbs(cls);
  };
  const convertBodyweight = (bodyweightKg: number): string => {
    if (attemptsInKg && bodyweightsInKg) {
      // Both are in kg, just format for display
      return convertKg(bodyweightKg, true);
    } else if (attemptsInKg && !bodyweightsInKg) {
      // Attempts are in kg and bw is in lbs, we will show bw in kg so just format
      return convertKg(bodyweightKg, true);
    } else if (!attemptsInKg && bodyweightsInKg) {
      // Attempts are in lbs but bw is in kg, convert bw to lbs
      return convertKg(bodyweightKg, false);
    } else {
      // Both are in lbs, convert bw to lbs
      return convertKg(bodyweightKg, false);
    }
  };

  // Initialize an empty row with all columns available.
  const row: Array<string> = Array(csv.fieldnames.length).fill("");

  if (!entryHasLifted(entry)) {
    row[csv.index("Place")] = "NS"; // No-Show.
  } else {
    row[csv.index("Place")] = finalEventTotalKg === 0 ? "DQ" : csvString(index + 1);
  }

  row[csv.index("Name")] = csvString(entry.name);
  row[csv.index("Instagram")] = csvString(entry.instagram);
  row[csv.index("Sex")] = csvString(entry.sex);
  row[csv.index("BirthDate")] = csvDate(entry.birthDate);
  row[csv.index("Age")] = csvString(getAge(entry, meetDate));
  row[csv.index("Country")] = csvString(entry.country);
  row[csv.index("State")] = csvString(entry.state);
  row[csv.index("Equipment")] = csvString(standardizeEquipment(entry.equipment));
  row[csv.index("Division")] = csvString(category.division);
  row[csv.index("Bodyweight" + unit)] = csvString(convertBodyweight(entry.bodyweightKg));
  row[csv.index("WeightClass" + unit)] = csvString(wtcls(category.weightClassStr));
  row[csv.index("Total" + unit)] = csvString(convertKg(finalEventTotalKg, attemptsInKg));
  row[csv.index("Event")] = csvString(category.event);
  row[csv.index("Team")] = csvString(entry.team);

  // Squat.
  if (category.event.includes("S")) {
    row[csv.index("Best3Squat" + unit)] = csvString(convertKg(getBest3SquatKg(entry), attemptsInKg));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Squat" + (i + 1) + unit;
      row[csv.index(field)] = csvString(convertKg(entry.squatKg[i] * entry.squatStatus[i], attemptsInKg));
    }
  }

  // Bench.
  if (category.event.includes("B")) {
    row[csv.index("Best3Bench" + unit)] = csvString(convertKg(getBest3BenchKg(entry), attemptsInKg));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Bench" + (i + 1) + unit;
      row[csv.index(field)] = csvString(convertKg(entry.benchKg[i] * entry.benchStatus[i], attemptsInKg));
    }
  }

  // Deadlift.
  if (category.event.includes("D")) {
    row[csv.index("Best3Deadlift" + unit)] = csvString(convertKg(getBest3DeadliftKg(entry), attemptsInKg));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Deadlift" + (i + 1) + unit;
      row[csv.index(field)] = csvString(convertKg(entry.deadliftKg[i] * entry.deadliftStatus[i], attemptsInKg));
    }
  }

  csv.rows.push(row);
};

const makeEntriesCsv = (state: GlobalState): Csv => {
  const attemptsInKg: boolean = state.meet.attemptsInKg;
  const bodyweightsInKg: boolean = state.meet.bodyweightsInKg;
  // The whole sheet will match the unit of the attempts.
  const unit: string = attemptsInKg ? "Kg" : "LBS";

  const csv = new Csv();

  const squatFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    squatFieldnames.push("Squat" + (i + 1) + unit);
  }
  squatFieldnames.push("Best3Squat" + unit);

  const benchFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    benchFieldnames.push("Bench" + (i + 1) + unit);
  }
  benchFieldnames.push("Best3Bench" + unit);

  const deadliftFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    deadliftFieldnames.push("Deadlift" + (i + 1) + unit);
  }
  deadliftFieldnames.push("Best3Deadlift" + unit);

  csv.fieldnames = Array.prototype.concat(
    ["Place", "Name", "Instagram", "Sex", "BirthDate", "Age", "Country", "State"],
    ["Equipment", "Division", "Bodyweight" + unit, "WeightClass" + unit],
    squatFieldnames,
    benchFieldnames,
    deadliftFieldnames,
    ["Total" + unit, "Event", "Team"]
  );

  const results: Array<CategoryResults> = getFinalResults(
    state.registration.entries,
    state.meet.weightClassesKgMen,
    state.meet.weightClassesKgWomen,
    state.meet.weightClassesKgMx,
    state.meet.combineSleevesAndWraps
  );

  for (let i = 0; i < results.length; i++) {
    const { category, orderedEntries } = results[i];

    for (let j = 0; j < orderedEntries.length; j++) {
      addEntriesRow(csv, category, unit, attemptsInKg, bodyweightsInKg, state.meet.date, orderedEntries[j], j);
    }
  }

  return csv;
};

export const exportAsOplCsv = (state: GlobalState): string => {
  const meetCsv: Csv = makeMeetCsv(state.meet);

  const entriesCsv: Csv = makeEntriesCsv(state);
  entriesCsv.removeEmptyColumns();

  const versionStr = "OPL Format v1,Submit by email:,issues@openpowerlifting.org";

  return versionStr + "\n\n" + meetCsv.toString() + "\n" + entriesCsv.toString();
};
