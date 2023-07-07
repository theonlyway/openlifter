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
import { getPoints } from "../coefficients/coefficients";
import { wtclsStrKg2Lbs } from "../../reducers/meetReducer";
import {
  getAge,
  getBest3SquatKg,
  getBest3BenchKg,
  getBest3DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted,
  MAX_ATTEMPTS,
} from "../entry";
import { displayPoints, displayWeight, kg2lbs } from "../units";

import { Category, CategoryResults } from "../divisionPlace";
import { Entry, Equipment, Formula } from "../../types/dataTypes";
import { GlobalState, MeetState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";
import { releaseVersion } from "../../versions";

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
    csvString(meet.formula),
  ];
  csv.rows = [row];

  // An optionalRuleSet column may be provided.
  let rules = "";
  if (meet.combineSleevesAndWraps === true) {
    rules += "CombineSleevesAndWraps ";
  }
  if (meet.combineSleevesAndWraps === true) {
    rules += "CombineSingleAndMulti ";
  }
  if (rules !== "") {
    csv.fieldnames.push("RuleSet");
    csv.rows[0].push(rules.trim());
  }

  return csv;
};

const standardizeEquipment = (eq: Equipment): string => {
  switch (eq) {
    case "Bare":
      return "Bare";
    case "Sleeves":
      return "Sleeves";
    case "Wraps":
      return "Wraps";
    case "Single-ply":
      return "Single-ply";
    case "Multi-ply":
      return "Multi-ply";
    case "Unlimited":
      return "Unlimited";
    default:
      checkExhausted(eq);
      return "Raw";
  }
};

const addEntriesRow = (
  csv: Csv,
  category: Category,
  inKg: boolean,
  meetDate: string,
  formula: Formula,
  entry: Entry,
  index: number,
) => {
  const unit: string = inKg ? "Kg" : "LBS";
  const finalEventTotalKg = getFinalEventTotalKg(entry, category.event);

  // Helper functions to keep things one-liners below. Handles Kg/Lbs conversion.
  const weight = (kg: number): string => {
    return displayWeight(inKg ? kg : kg2lbs(kg));
  };
  const wtcls = (cls: string): string => {
    return inKg ? cls : wtclsStrKg2Lbs(cls);
  };

  // Initialize an empty row with all columns available.
  const row: Array<string> = Array(csv.fieldnames.length).fill("");

  if (!entryHasLifted(entry)) {
    row[csv.index("Place")] = "NS"; // No-Show.
  } else if (entry.guest) {
    row[csv.index("Place")] = "G"; // Guest
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
  row[csv.index("Lot")] = csvString(entry.lot == 0 ? "" : entry.lot);
  row[csv.index("Bodyweight" + unit)] = csvString(weight(entry.bodyweightKg));
  row[csv.index("WeightClass" + unit)] = csvString(wtcls(category.weightClassStr));
  row[csv.index("Total" + unit)] = csvString(weight(finalEventTotalKg));
  row[csv.index("Event")] = csvString(category.event);
  row[csv.index("Team")] = csvString(entry.team);

  // Squat.
  if (category.event.includes("S")) {
    row[csv.index("Best3Squat" + unit)] = csvString(weight(getBest3SquatKg(entry)));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Squat" + (i + 1) + unit;
      row[csv.index(field)] = csvString(weight(entry.squatKg[i] * entry.squatStatus[i]));
    }
  }

  // Bench.
  if (category.event.includes("B")) {
    row[csv.index("Best3Bench" + unit)] = csvString(weight(getBest3BenchKg(entry)));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Bench" + (i + 1) + unit;
      row[csv.index(field)] = csvString(weight(entry.benchKg[i] * entry.benchStatus[i]));
    }
  }

  // Deadlift.
  if (category.event.includes("D")) {
    row[csv.index("Best3Deadlift" + unit)] = csvString(weight(getBest3DeadliftKg(entry)));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Deadlift" + (i + 1) + unit;
      row[csv.index(field)] = csvString(weight(entry.deadliftKg[i] * entry.deadliftStatus[i]));
    }
  }

  // Points. OpenPowerlifting does not use this column, but people have asked for it.
  const points = getPoints(formula, entry, category.event, finalEventTotalKg, inKg);
  row[csv.index("Points")] = csvString(points === 0 ? "" : displayPoints(points, "en"));

  csv.rows.push(row);
};

const makeEntriesCsv = (state: GlobalState): Csv => {
  const inKg: boolean = state.meet.inKg;
  const unit: string = inKg ? "Kg" : "LBS";

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
    ["Equipment", "Division", "Lot", "Bodyweight" + unit, "WeightClass" + unit],
    squatFieldnames,
    benchFieldnames,
    deadliftFieldnames,
    ["Total" + unit, "Points", "Event", "Team"],
  );

  const results: Array<CategoryResults> = getFinalResults(
    state.registration.entries,
    state.meet.weightClassesKgMen,
    state.meet.weightClassesKgWomen,
    state.meet.weightClassesKgMx,
    state.meet.combineSleevesAndWraps,
    state.meet.combineSingleAndMulti,
  );

  const meet_date = state.meet.date;
  const formula: Formula = state.meet.formula;

  for (let i = 0; i < results.length; i++) {
    const { category, orderedEntries } = results[i];

    for (let j = 0; j < orderedEntries.length; j++) {
      addEntriesRow(csv, category, inKg, meet_date, formula, orderedEntries[j], j);
    }
  }

  return csv;
};

export const exportAsOplCsv = (state: GlobalState): string => {
  const meetCsv: Csv = makeMeetCsv(state.meet);

  const entriesCsv: Csv = makeEntriesCsv(state);
  entriesCsv.removeEmptyColumns();

  const versionStr = `OPL Format v1 (OpenLifter ${releaseVersion}),Submit by email:,issues@openpowerlifting.org`;

  return versionStr + "\n\n" + meetCsv.toString() + "\n" + entriesCsv.toString();
};
