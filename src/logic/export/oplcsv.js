// vim: set ts=2 sts=2 sw=2 et:
// @flow strict
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

import { csvString, Csv } from "./csv";
import { getFinalResults } from "../divisionPlace";
import { getBest3SquatKg, getBest3BenchKg, getBest3DeadliftKg, getFinalEventTotalKg, MAX_ATTEMPTS } from "../entry";

import type { Category, CategoryResults } from "../divisionPlace";
import type { Entry } from "../../types/dataTypes";
import type { GlobalState, MeetState } from "../../types/stateTypes";

const makeMeetCsv = (meet: MeetState): Csv => {
  let csv = new Csv();
  csv.fieldnames = ["Federation", "Date", "MeetCountry", "MeetState", "MeetTown", "MeetName"];

  const row: Array<string> = [
    csvString(meet.federation),
    csvString(meet.date),
    csvString(meet.country),
    csvString(meet.state),
    csvString(meet.city),
    csvString(meet.name)
  ];
  csv.rows = [row];
  return csv;
};

const makeEntriesCsv = (state: GlobalState): Csv => {
  let csv = new Csv();

  let squatFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    squatFieldnames.push("Squat" + (i + 1) + "Kg");
  }
  squatFieldnames.push("Best3SquatKg");

  let benchFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    benchFieldnames.push("Bench" + (i + 1) + "Kg");
  }
  benchFieldnames.push("Best3BenchKg");

  let deadliftFieldnames = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    deadliftFieldnames.push("Deadlift" + (i + 1) + "Kg");
  }
  deadliftFieldnames.push("Best3DeadliftKg");

  csv.fieldnames = Array.prototype.concat(
    ["Place", "Name", "Sex", "BirthDate", "Age", "Country", "State"],
    ["Equipment", "Division", "BodyweightKg", "WeightClassKg"],
    squatFieldnames,
    benchFieldnames,
    deadliftFieldnames,
    ["TotalKg", "Event"]
  );

  const results: Array<CategoryResults> = getFinalResults(
    state.registration.entries,
    state.meet.weightClassesKgMen,
    state.meet.weightClassesKgWomen,
    state.meet.weightClassesKgMx
  );

  for (let i = 0; i < results.length; i++) {
    const { category, orderedEntries } = results[i];

    for (let j = 0; j < orderedEntries.length; j++) {
      addEntriesRow(csv, category, orderedEntries[j], j);
    }
  }

  return csv;
};

const addEntriesRow = (csv: Csv, category: Category, entry: Entry, index: number) => {
  const finalEventTotalKg = getFinalEventTotalKg(entry, category.event);

  // Initialize an empty row with all columns available.
  let row: Array<string> = Array(csv.fieldnames.length).fill("");

  row[csv.index("Place")] = finalEventTotalKg === 0 ? "DQ" : csvString(index + 1);
  row[csv.index("Name")] = csvString(entry.name);
  row[csv.index("Sex")] = csvString(entry.sex);
  row[csv.index("BirthDate")] = csvString(entry.birthDate);
  row[csv.index("Age")] = csvString(entry.age);
  row[csv.index("Country")] = csvString(entry.country);
  row[csv.index("State")] = csvString(entry.state);
  row[csv.index("Equipment")] = csvString(entry.equipment);
  row[csv.index("Division")] = csvString(category.division);
  row[csv.index("BodyweightKg")] = csvString(entry.bodyweightKg);
  row[csv.index("WeightClassKg")] = csvString(category.weightClassStr);
  row[csv.index("TotalKg")] = csvString(finalEventTotalKg);
  row[csv.index("Event")] = csvString(category.event);

  // Squat.
  if (category.event.includes("S")) {
    row[csv.index("Best3SquatKg")] = csvString(getBest3SquatKg(entry));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Squat" + (i + 1) + "Kg";
      row[csv.index(field)] = csvString(entry.squatKg[i] * entry.squatStatus[i]);
    }
  }

  // Bench.
  if (category.event.includes("B")) {
    row[csv.index("Best3BenchKg")] = csvString(getBest3BenchKg(entry));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Bench" + (i + 1) + "Kg";
      row[csv.index(field)] = csvString(entry.benchKg[i] * entry.benchStatus[i]);
    }
  }

  // Deadlift.
  if (category.event.includes("D")) {
    row[csv.index("Best3DeadliftKg")] = csvString(getBest3DeadliftKg(entry));
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const field = "Deadlift" + (i + 1) + "Kg";
      row[csv.index(field)] = csvString(entry.deadliftKg[i] * entry.deadliftStatus[i]);
    }
  }

  csv.rows.push(row);
};

export const exportAsOplCsv = (state: GlobalState): string => {
  const meetCsv: Csv = makeMeetCsv(state.meet);

  let entriesCsv: Csv = makeEntriesCsv(state);
  entriesCsv.removeEmptyColumns();

  const versionStr = "OPL Format v1";

  return versionStr + "\n\n" + meetCsv.toString() + "\n" + entriesCsv.toString();
};
