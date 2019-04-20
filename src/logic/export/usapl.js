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

import { csvString, Csv } from "./csv";
import { getFinalResults } from "../divisionPlace";

import type { Category, CategoryResults } from "../divisionPlace";
import type { Entry, Event } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

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

// Converts the ISO8601 entry.birthDate to USAPL MM/DD/YYYY format.
const makeBirthDate = (entry: Entry): string => {
  if (entry.birthDate === undefined || entry.birthDate === "") {
    return "";
  }
  let [year, month, day]: Array<string> = entry.birthDate.split("-");
  return month + "/" + day + "/" + year;
};

// Given an Entry and its index in the CategoryResults.orderedEntries,
// render all that information as a one-liner CSV string.
const addDataRow = (csv: Csv, category: Category, entry: Entry) => {
  const hasSquat: boolean = category.event.includes("S");
  const hasBench: boolean = category.event.includes("B");
  const hasDL: boolean = category.event.includes("D");

  // Initialize an empty row with all columns available.
  let row: Array<string> = Array(csv.fieldnames.length).fill("");

  row[csv.index("Name")] = csvString(entry.name);
  // TODO: Team.
  row[csv.index("Div")] = csvString(category.division);
  row[csv.index("Bwt - kg")] = csvString(entry.bodyweightKg);
  row[csv.index("IPF Wt Cls")] = csvString(category.weightClassStr);
  row[csv.index("DOB")] = csvString(makeBirthDate(entry));
  row[csv.index("Squat 1")] = csvString(hasSquat ? entry.squatKg[0] * entry.squatStatus[0] : 0);
  row[csv.index("Squat 2")] = csvString(hasSquat ? entry.squatKg[1] * entry.squatStatus[1] : 0);
  row[csv.index("Squat 3")] = csvString(hasSquat ? entry.squatKg[2] * entry.squatStatus[2] : 0);
  row[csv.index("Bench 1")] = csvString(hasBench ? entry.benchKg[0] * entry.benchStatus[0] : 0);
  row[csv.index("Bench 2")] = csvString(hasBench ? entry.benchKg[1] * entry.benchStatus[1] : 0);
  row[csv.index("Bench 3")] = csvString(hasBench ? entry.benchKg[2] * entry.benchStatus[2] : 0);
  row[csv.index("Deadlift 1")] = csvString(hasDL ? entry.deadliftKg[0] * entry.deadliftStatus[0] : 0);
  row[csv.index("Deadlift 2")] = csvString(hasDL ? entry.deadliftKg[1] * entry.deadliftStatus[1] : 0);
  row[csv.index("Deadlift 3")] = csvString(hasDL ? entry.deadliftKg[2] * entry.deadliftStatus[2] : 0);
  row[csv.index("Event")] = csvString(translateEvent(category.event));
  row[csv.index("State")] = csvString(entry.state);
  row[csv.index("MemberID")] = csvString(entry.memberId);
  // TODO: Drug Test.

  csv.rows.push(row);
};

export const exportAsUSAPLCsv = (state: GlobalState): string => {
  let csv = new Csv();
  csv.fieldnames = [
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
      addDataRow(csv, category, orderedEntries[j]);
    }
  }

  return csv.toString();
};
