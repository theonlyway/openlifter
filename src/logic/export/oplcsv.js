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

import { getFinalResults } from "../divisionPlace";

import { getBest3SquatKg, getBest3BenchKg, getBest3DeadliftKg, getFinalEventTotalKg, MAX_ATTEMPTS } from "../entry";

import type { Category, CategoryResults } from "../divisionPlace";
import type { Entry } from "../../types/dataTypes";
import type { GlobalState, MeetState } from "../../types/stateTypes";

// Makes a string suitable for inclusion in a simple CSV file,
// by deleting all commas and double quotes.
const csvString = (x: number | string): string => {
  if (x === undefined) return "";
  let s = String(x);

  // The OpenPowerlifting format uses commas and disallow double-quotes.
  s = s.replace(/,/g, " ");
  s = s.replace(/"/g, " ");

  // The number "0" is also never written out explicitly; the empty string is preferred.
  if (s === "0") return "";

  // Clean up some formatting.
  s = s.replace(/ {2}/g, " ").trim();
  return s;
};

const makeMeetCsv = (meet: MeetState): string => {
  const headers: Array<string> = ["Federation", "Date", "MeetCountry", "MeetState", "MeetTown", "MeetName"];
  const cells: Array<string> = [
    csvString(meet.federation),
    csvString(meet.date),
    csvString(meet.country),
    csvString(meet.state),
    csvString(meet.city),
    csvString(meet.name)
  ];
  return headers.join(",") + "\n" + cells.join(",");
};

const makeEntriesHeaderRow = (): string => {
  let headers = [
    "Place",
    "Name",
    "Sex",
    "BirthDate",
    "Age",
    "Country",
    "State",
    "Equipment",
    "Division",
    "BodyweightKg",
    "WeightClassKg"
  ];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    headers.push("Squat" + (i + 1) + "Kg");
  }
  headers.push("Best3SquatKg");

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    headers.push("Bench" + (i + 1) + "Kg");
  }
  headers.push("Best3BenchKg");

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    headers.push("Deadlift" + (i + 1) + "Kg");
  }
  headers.push("Best3DeadliftKg");

  headers.push("TotalKg");
  headers.push("Event");
  return headers.join(",");
};

// Given an Entry and its index in the CategoryResults.orderedEntries,
// render all that information as a one-liner CSV string.
const makeEntriesRow = (category: Category, entry: Entry, index: number): string => {
  const finalEventTotalKg = getFinalEventTotalKg(entry, category.event);

  let columns: Array<string> = [
    finalEventTotalKg === 0 ? "DQ" : csvString(index + 1), // Place.
    csvString(entry.name), // Name.
    csvString(entry.sex), // Sex.
    csvString(entry.birthDate), // BirthDate.
    csvString(entry.age), // Age.
    csvString(entry.country), // Country.
    csvString(entry.state), // State.
    csvString(entry.equipment), // Equipment.
    csvString(category.division), // Division.
    csvString(entry.bodyweightKg), // BodyweightKg.
    csvString(category.weightClassStr) // WeightClassKg.
  ];

  // Squat(1-5)Kg.
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (category.event.includes("S")) {
      columns.push(csvString(entry.squatKg[i] * entry.squatStatus[i]));
    } else {
      columns.push("");
    }
  }

  // Best3SquatKg.
  if (category.event.includes("S")) {
    const best3SquatKg = getBest3SquatKg(entry);
    columns.push(best3SquatKg === 0 ? "" : csvString(best3SquatKg));
  } else {
    columns.push("");
  }

  // Bench(1-5)Kg.
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (category.event.includes("B")) {
      columns.push(csvString(entry.benchKg[i] * entry.benchStatus[i]));
    } else {
      columns.push("");
    }
  }

  // Best3BenchKg.
  if (category.event.includes("B")) {
    const best3BenchKg = getBest3BenchKg(entry);
    columns.push(best3BenchKg === 0 ? "" : csvString(best3BenchKg));
  } else {
    columns.push("");
  }

  // Deadlift(1-5)Kg
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (category.event.includes("D")) {
      columns.push(csvString(entry.deadliftKg[i] * entry.deadliftStatus[i]));
    } else {
      columns.push("");
    }
  }

  // Best3DeadliftKg.
  if (category.event.includes("D")) {
    const best3DeadliftKg = getBest3DeadliftKg(entry);
    columns.push(best3DeadliftKg === 0 ? "" : csvString(best3DeadliftKg));
  } else {
    columns.push("");
  }

  // Event Total.
  columns.push(finalEventTotalKg !== 0 ? csvString(finalEventTotalKg) : "");

  // Event.
  columns.push(csvString(category.event));

  return columns.join(",");
};

export const exportAsOplCsv = (state: GlobalState): string => {
  const results: Array<CategoryResults> = getFinalResults(
    state.registration.entries,
    state.meet.weightClassesKgMen,
    state.meet.weightClassesKgWomen,
    state.meet.weightClassesKgMx
  );

  const meetCsv: string = makeMeetCsv(state.meet);

  let entriesCsv: Array<string> = [makeEntriesHeaderRow()];
  for (let i = 0; i < results.length; i++) {
    const { category, orderedEntries } = results[i];

    for (let j = 0; j < orderedEntries.length; j++) {
      const row = makeEntriesRow(category, orderedEntries[j], j);
      entriesCsv.push(row);
    }
  }

  const versionStr = "OPL Format v1";

  return versionStr + "\n\n" + meetCsv + "\n\n" + entriesCsv.join("\n");
};
