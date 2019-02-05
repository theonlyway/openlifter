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

// Exports data to a spreadsheet format used by the USAPL.

import { getFinalResults } from "../divisionPlace";

import type { Category, CategoryResults } from "../divisionPlace";
import type { Entry, Event } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

// Makes a string suitable for inclusion in a simple CSV file,
// by deleting all commas and double quotes.
const csvString = (x: number | string): string => {
  let s = String(x);

  // Since we're rendering to CSV, disallow commas and double-quotes.
  s = s.replace(/,/g, " ");
  s = s.replace(/"/g, " ");

  // The number "0" is never written out explicitly; the empty string is preferred.
  if (s === "0") return "";

  // Clean up some formatting.
  s = s.replace(/ {2}/g, " ").trim();
  return s;
};

const makeHeaderRow = (): string => {
  let headers = [
    "Name",
    "Team",
    "Div", // Division.
    "Bwt - kg", // Bodyweight, kg.
    "IPF Wt Cls", // IPF Weight Class (SHW as "120+", same format).
    "DOB", // Date of Birth, in MM/DD/YYYY format.
    "Squat 1", // Units unspecified, but seem to be kg.
    "Squat 2",
    "Squat 3",
    "Bench 1",
    "Bench 2",
    "Bench 3",
    "Deadlift 1",
    "Deadlift 2",
    "Deadlift 3",
    "Event", // In NextLifter format (PL, BO, etc.).
    "State", // USA state of residence of the lifter, as abbreviation.
    "MemberID",
    "Drug Test" // "Y" if a test was performed, blank otherwise.
  ];
  return headers.join(",");
};

// Translates the event from our format to the NextLifter format.
const translateEvent = (ev: Event): string => {
  switch (ev) {
    // Variants present in the NextLifter software.
    case "SBD":
      return "PL";
    case "BD":
      return "PP";
    case "S":
      return "SQ";
    case "B":
      return "BP";
    case "D":
      return "DL";

    // These variants aren't selectable in NextLifter, so the USAPL doesn't use them.
    case "SB":
      return "SB";
    case "SD":
      return "SD";
    default:
      (ev: empty); // eslint-disable-line
      return ev;
  }
};

// Given an Entry and its index in the CategoryResults.orderedEntries,
// render all that information as a one-liner CSV string.
const makeDataRow = (category: Category, entry: Entry): string => {
  const columns: Array<string> = [
    csvString(entry.name), // Name.
    "", // TODO: Team.
    csvString(category.division), // Division.
    csvString(entry.bodyweightKg), // BodyweightKg.
    csvString(category.weightClassStr), // WeightClassKg.
    csvString(entry.birthDate), // BirthDate. TODO: Should be MM/DD/YYYY.
    csvString(entry.squatKg[0] * entry.squatStatus[0]), // Squat 1.
    csvString(entry.squatKg[1] * entry.squatStatus[1]), // Squat 2.
    csvString(entry.squatKg[2] * entry.squatStatus[2]), // Squat 3.
    csvString(entry.benchKg[0] * entry.benchStatus[0]), // Bench 1.
    csvString(entry.benchKg[1] * entry.benchStatus[1]), // Bench 2.
    csvString(entry.benchKg[2] * entry.benchStatus[2]), // Bench 3.
    csvString(entry.deadliftKg[0] * entry.deadliftStatus[0]), // Deadlift 1.
    csvString(entry.deadliftKg[1] * entry.deadliftStatus[1]), // Deadlift 2.
    csvString(entry.deadliftKg[2] * entry.deadliftStatus[2]), // Deadlift 3.
    csvString(translateEvent(category.event)), // Event.
    "", // TODO: State.
    "", // TODO: MemberID.
    "" // TODO: Drug Test.
  ];
  return columns.join(",");
};

export const exportAsUSAPLCsv = (state: GlobalState): string => {
  const results: Array<CategoryResults> = getFinalResults(
    state.registration.entries,
    state.meet.weightClassesKgMen,
    state.meet.weightClassesKgWomen,
    state.meet.weightClassesKgMx
  );

  let csv: Array<string> = [makeHeaderRow()];
  for (let i = 0; i < results.length; i++) {
    const { category, orderedEntries } = results[i];

    for (let j = 0; j < orderedEntries.length; j++) {
      const row = makeDataRow(category, orderedEntries[j]);
      csv.push(row);
    }
  }

  return csv.join("\n");
};
