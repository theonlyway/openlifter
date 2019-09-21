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

// Defines logic for importing Registration data from a CSV file.
// The CSV format is very strict: no double-quotes allowed, commas are always
// separators, and the format of each field must exactly match our internal format.

import { Csv, getSpreadsheetColumnName } from "../export/csv";
import { newDefaultEntry } from "../entry";

import { parseInteger, parseEquipment, parseEvent, parseSex, parseDate } from "../parsers";

import { Entry, Flight } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { assertFlight } from "../../types/utils";

// Generates a string representing a downloadable CSV file, for use as an example
// of the registration format.
//
// This is in code so that it can live right next to loadRegistrations()
// for easier long-term maintenance.
export const makeExampleRegistrationsCsv = (): string => {
  let csv = new Csv();
  csv.rows = [[]]; // appendColumns() will resize the dummy row correctly.

  csv.appendColumns(["Day", "Platform", "Flight", "Name", "Sex", "Equipment"]);
  csv.appendColumns(["Division1", "Division2", "Division3"]);
  csv.appendColumns(["Event1", "Event2", "Event3"]);
  csv.appendColumns(["BirthDate", "MemberID", "Country", "State", "Lot", "Team"]);
  csv.appendColumns(["Instagram", "Notes"]);

  csv.rows[0][csv.index("Day")] = "1";
  csv.rows[0][csv.index("Platform")] = "1";
  csv.rows[0][csv.index("Flight")] = "A";
  csv.rows[0][csv.index("Name")] = "Emily Example";
  csv.rows[0][csv.index("Sex")] = "F";
  csv.rows[0][csv.index("Equipment")] = "Sleeves";
  csv.rows[0][csv.index("Division1")] = "Open";
  csv.rows[0][csv.index("Division2")] = "J20-23";
  // Intentionally blank: csv.rows[0][csv.index("Division3")]
  csv.rows[0][csv.index("Event1")] = "SBD";
  csv.rows[0][csv.index("Event2")] = "BD";
  // Intentionally blank: csv.rows[0][csv.index("Event3")]
  csv.rows[0][csv.index("BirthDate")] = "1998-02-16";
  // Intentionally blank: csv.rows[0][csv.index("MemberID")]
  csv.rows[0][csv.index("Country")] = "USA";
  csv.rows[0][csv.index("State")] = "NY";
  // Intentionally blank: csv.rows[0][csv.index("Lot")]
  // Intentionally blank: csv.rows[0][csv.index("Team")]
  csv.rows[0][csv.index("Instagram")] = "emily_example_";
  csv.rows[0][csv.index("Notes")] = "emily@example.com: she's the best!";

  return csv.toString();
};

// Every fieldname must be either mandatory or optional.
const MANDATORY_FIELDNAMES = ["Day", "Platform", "Flight", "Name", "Sex", "Equipment", "Division1", "Event1"];
const OPTIONAL_FIELDNAMES = [
  "Division2",
  "Division3",
  "Division4",
  "Division5",
  "Event2",
  "Event3",
  "Event4",
  "Event5",
  "BirthDate",
  "MemberID",
  "Country",
  "State",
  "Lot",
  "Team",
  "Instagram",
  "Notes"
];

// Attempts to load registration information from a CSV object.
//
// On success, returns an array of Entry objects.
//   NOTE CAREFULLY that the global state is not updated by this function.
//   The caller must integrate the Entry objects, updating EntryID Tracking.
// On failure, returns an error string with a user-presentable message.
export const loadRegistrations = (state: GlobalState, csv: Csv): Array<Entry> | string => {
  // Check the existent fieldnames for sanity.
  for (let i = 0; i < csv.fieldnames.length; ++i) {
    const name: string = csv.fieldnames[i];

    // Every fieldname that appears must be known.
    if (!MANDATORY_FIELDNAMES.includes(name) && !OPTIONAL_FIELDNAMES.includes(name)) {
      const colname = getSpreadsheetColumnName(i);
      const allfields: string = MANDATORY_FIELDNAMES.join(", ") + ", " + OPTIONAL_FIELDNAMES.join(", ");

      let e = "Unknown fieldname '" + name + "' in column " + colname + ".";
      e += " Here's a list of all accepted column names: " + allfields;
      return e;
    }

    // Fieldnames cannot be repeated.
    for (let j = i + 1; j < csv.fieldnames.length; ++j) {
      if (csv.fieldnames[j] === csv.fieldnames[i]) {
        const iname = getSpreadsheetColumnName(i);
        const jname = getSpreadsheetColumnName(j);

        let e = 'The column "' + csv.fieldnames[i] + '" occurs in two columns:';
        e += " " + iname + " and " + jname;
        return e;
      }
    }
  }

  // Check that all of the MANDATORY_FIELDNAMES are included.
  for (let i = 0; i < MANDATORY_FIELDNAMES.length; ++i) {
    if (!csv.fieldnames.includes(MANDATORY_FIELDNAMES[i])) {
      return 'The mandatory "' + MANDATORY_FIELDNAMES[i] + '" column is missing';
    }
  }

  // The "Platform" column" must occur after the "Day" column: the parsing
  // below is stateful, and needs to know how many platforms are on that day
  // when it reads in the platform value.
  if (csv.fieldnames.indexOf("Platform") <= csv.fieldnames.indexOf("Day")) {
    return "The Day column must come before the Platform column";
  }

  // The caller needs to update this field on the state later, if successful.
  let nextEntryId = state.registration.nextEntryId;
  let entries: Array<Entry> = [];

  // The fieldnames are valid! Now we can start building Entries.
  for (let i = 0; i < csv.rows.length; ++i) {
    let entry: Entry = newDefaultEntry(nextEntryId++);
    entries.push(entry);

    // Iterate over each field and integrate it into the Entry object.
    let row: Array<string> = csv.rows[i];
    for (let j = 0; j < row.length; ++j) {
      let fieldname = csv.fieldnames[j];
      let val = row[j];

      // User-visible row number, for error messages.
      // The first row is for the fieldnames, and spreadsheet programs are 1-indexed.
      let rowstr = String(i + 2);

      // Start building the error string early, since it's repeated a lot.
      let errprefix = "Invalid " + fieldname + " '" + val + "' in row " + rowstr + ": ";

      switch (fieldname) {
        case "Day": {
          if (val === "") {
            // Default to 1.
            entry.day = 1;
            break;
          }

          const integer = parseInteger(val);

          // Must be an integer.
          if (typeof integer !== "number") {
            return errprefix + "expected an integer";
          }

          // Can't be less than one: there's always at least one day.
          if (integer < 1) {
            return errprefix + "can't be less than 1";
          }

          // Can't be greater than the number of days specified in the GlobalState.
          const numDays = state.meet.lengthDays;
          if (integer > numDays) {
            return errprefix + "the Meet Setup page specifies only " + numDays + " days";
          }

          // All checks passed!
          entry.day = integer;
          break;
        }

        case "Platform": {
          if (val === "") {
            // Default to 1.
            entry.platform = 1;
            break;
          }

          const integer = parseInteger(val);

          // Must be an integer.
          if (typeof integer !== "number") {
            return errprefix + "expected an integer";
          }

          // Can't be less than one: there's always at least one platform.
          if (integer < 1) {
            return errprefix + "can't be less than 1";
          }

          // Can't be greater than the number of platforms specified in the GlobalState.
          // The "Day" column is guaranteed to already have been parsed: code above
          // makes sure the "Day" column is before the "Platform" column.
          const day = entry.day;
          const platforms = state.meet.platformsOnDays[day];
          if (integer > platforms) {
            return errprefix + "Day " + day + " only has " + platforms + " platforms";
          }

          // All checks passed!
          entry.platform = integer;
          break;
        }

        case "Flight": {
          if (val === "") {
            // Default to A.
            entry.flight = "A";
            break;
          }

          if (val.length !== 1) {
            return errprefix + "expected just a single flight letter";
          }

          if ("ABCDEFGHIJKLMNOP".indexOf(val) === -1) {
            return errprefix + "expected a flight letter, A through P";
          }

          // All checks passed!
          // Narrow the type to flight (or throw an error if we've broken our validation) and continue
          if (assertFlight(val)) {
            entry.flight = val;
          }
          break;
        }

        case "Name": {
          if (val === "") {
            return errprefix + "every lifter needs a Name";
          }
          if (val.toUpperCase() === val) {
            return errprefix + "the Name should not be all-uppercase";
          }
          entry.name = val;
          break;
        }

        case "Sex": {
          const sex = parseSex(val);
          if (typeof sex !== "string") {
            return errprefix + "valid values are M, F, and Mx";
          }
          entry.sex = sex;
          break;
        }

        case "Equipment": {
          const eqt = parseEquipment(val);
          if (typeof eqt !== "string") {
            return errprefix + "valid values are 'Bare', 'Sleeves', 'Wraps', 'Single-ply', and 'Multi-ply'";
          }
          entry.equipment = eqt;
          break;
        }

        case "Division1": // fallthrough
        case "Division2": // fallthrough
        case "Division3": // fallthrough
        case "Division4": // fallthrough
        case "Division5": {
          // Only the first Division is mandatory.
          if (val === "" && fieldname !== "Division1") {
            break;
          }

          // Check that it appears as a valid division.
          if (!state.meet.divisions.includes(val)) {
            return errprefix + "not a valid division per the Meet Setup page";
          }

          // Check that it wasn't already added.
          if (entry.divisions.includes(val)) {
            return errprefix + "the lifter is already in that Division";
          }

          entry.divisions.push(val);
          break;
        }

        case "Event1": // fallthrough
        case "Event2": // fallthrough
        case "Event3": // fallthrough
        case "Event4": // fallthrough
        case "Event5": {
          // Only the first Event is mandatory.
          if (val === "" && fieldname !== "Event1") {
            break;
          }

          // Check that it's well-formed.
          const evt = parseEvent(val);
          if (typeof evt !== "string") {
            return errprefix + "should be formed like 'SBD', 'BD', 'B', etc.";
          }

          // Check for duplicates.
          if (entry.events.includes(evt)) {
            return errprefix + "the lifter is already registered for that Event";
          }

          // All checks passed!
          entry.events.push(evt);
          break;
        }

        case "BirthDate": {
          if (val === "") {
            // BirthDate is optional.
            break;
          }

          const bd = parseDate(val);
          if (typeof bd !== "string") {
            let e = "date must be in the unambiguous international standard: YYYY-MM-DD";
            return errprefix + e;
          }

          entry.birthDate = bd;
          break;
        }

        case "MemberID":
          entry.memberId = val;
          break;

        case "Country":
          entry.country = val;
          break;

        case "State":
          entry.state = val;
          break;

        case "Lot": {
          if (val === "") {
            // Empty strings are allowed: just doesn't use lots.
            break;
          }

          const integer = parseInteger(val);
          if (typeof integer !== "number" || integer < 1) {
            return errprefix + "expected an empty cell or a positive integer";
          }

          // All checks passed!
          entry.lot = integer;
          break;
        }

        case "Team":
          entry.team = val;
          break;

        case "Instagram":
          entry.instagram = val;
          break;

        case "Notes":
          entry.notes = val;
          break;

        default:
          return 'Missing handler for the "' + fieldname + '" column';
      }
    }
  }

  return entries;
};
