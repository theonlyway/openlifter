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
import { getString, delocalizeEquipment, delocalizeEvent, delocalizeFlight, delocalizeSex } from "../strings";
import { displayNumber } from "../units";

import { Entry, Flight, Language } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { assertFlight } from "../../types/utils";

// Generates a string representing a downloadable CSV file, for use as an example
// of the registration format.
//
// This is in code so that it can live right next to loadRegistrations()
// for easier long-term maintenance.
export const makeExampleRegistrationsCsv = (language: Language): string => {
  let csv = new Csv();
  csv.rows = [[]]; // appendColumns() will resize the dummy row correctly.

  const day = getString("import.column-day", language);
  const platform = getString("import.column-platform", language);
  const flight = getString("import.column-flight", language);
  const name = getString("import.column-name", language);
  const sex = getString("import.column-sex", language);
  const equipment = getString("import.column-equipment", language);
  const division1 = getString("import.column-division-n", language).replace("{N}", "1");
  const division2 = getString("import.column-division-n", language).replace("{N}", "2");
  const division3 = getString("import.column-division-n", language).replace("{N}", "3");
  const event1 = getString("import.column-event-n", language).replace("{N}", "1");
  const event2 = getString("import.column-event-n", language).replace("{N}", "2");
  const event3 = getString("import.column-event-n", language).replace("{N}", "3");
  const birthdate = getString("import.column-birthdate", language);
  const memberid = getString("import.column-memberid", language);
  const country = getString("import.column-country", language);
  const state = getString("import.column-state", language);
  const lot = getString("import.column-lot", language);
  const team = getString("import.column-team", language);
  const instagram = getString("import.column-instagram", language);
  const notes = getString("import.column-notes", language);

  csv.appendColumns([day, platform, flight, name, sex, equipment]);
  csv.appendColumns([division1, division2, division3, event1, event2, event3]);
  csv.appendColumns([birthdate, memberid, country, state, lot, team, instagram, notes]);

  csv.rows[0][csv.index(day)] = "1";
  csv.rows[0][csv.index(platform)] = "1";
  csv.rows[0][csv.index(flight)] = "A";
  csv.rows[0][csv.index(name)] = getString("import.example-name", language);
  csv.rows[0][csv.index(sex)] = getString("import.example-sex", language);
  csv.rows[0][csv.index(equipment)] = getString("equipment.sleeves", language);
  csv.rows[0][csv.index(division1)] = getString("import.example-division1", language);
  csv.rows[0][csv.index(division2)] = getString("import.example-division2", language);
  // Intentionally blank: csv.rows[0][csv.index(division3)]
  csv.rows[0][csv.index(event1)] = getString("event.sbd", language);
  csv.rows[0][csv.index(event2)] = getString("event.bd", language);
  // Intentionally blank: csv.rows[0][csv.index(event3)]
  csv.rows[0][csv.index(birthdate)] = getString("import.example-birthdate", language);
  // Intentionally blank: csv.rows[0][csv.index(memberid)]
  csv.rows[0][csv.index(country)] = getString("import.example-country", language);
  csv.rows[0][csv.index(state)] = getString("import.example-state", language);
  // Intentionally blank: csv.rows[0][csv.index(lot)]
  // Intentionally blank: csv.rows[0][csv.index(team)]
  csv.rows[0][csv.index(instagram)] = getString("import.example-instagram", language);
  csv.rows[0][csv.index(notes)] = getString("import.example-notes", language);

  return csv.toString();
};

// Attempts to load registration information from a CSV object.
//
// On success, returns an array of Entry objects.
//   NOTE CAREFULLY that the global state is not updated by this function.
//   The caller must integrate the Entry objects, updating EntryID Tracking.
// On failure, returns an error string with a user-presentable message.
export const loadRegistrations = (state: GlobalState, csv: Csv, language: Language): Array<Entry> | string => {
  const division_template = getString("import.column-division-n", language);
  const event_template = getString("import.column-event-n", language);

  const col_day = getString("import.column-day", language);
  const col_platform = getString("import.column-platform", language);
  const col_flight = getString("import.column-flight", language);
  const col_name = getString("import.column-name", language);
  const col_sex = getString("import.column-sex", language);
  const col_equipment = getString("import.column-equipment", language);
  const col_division1 = division_template.replace("{N}", "1");
  const col_division2 = division_template.replace("{N}", "2");
  const col_division3 = division_template.replace("{N}", "3");
  const col_division4 = division_template.replace("{N}", "4");
  const col_division5 = division_template.replace("{N}", "5");
  const col_event1 = event_template.replace("{N}", "1");
  const col_event2 = event_template.replace("{N}", "2");
  const col_event3 = event_template.replace("{N}", "3");
  const col_event4 = event_template.replace("{N}", "4");
  const col_event5 = event_template.replace("{N}", "5");
  const col_birthdate = getString("import.column-birthdate", language);
  const col_memberid = getString("import.column-memberid", language);
  const col_country = getString("import.column-country", language);
  const col_state = getString("import.column-state", language);
  const col_lot = getString("import.column-lot", language);
  const col_team = getString("import.column-team", language);
  const col_instagram = getString("import.column-instagram", language);
  const col_notes = getString("import.column-notes", language);

  // Every fieldname must be either mandatory or optional.
  const MANDATORY_FIELDNAMES = [
    col_day,
    col_platform,
    col_flight,
    col_name,
    col_sex,
    col_equipment,
    col_division1,
    col_event1
  ];
  const OPTIONAL_FIELDNAMES = [
    col_division2,
    col_division3,
    col_division4,
    col_division5,
    col_event2,
    col_event3,
    col_event4,
    col_event5,
    col_birthdate,
    col_memberid,
    col_country,
    col_state,
    col_lot,
    col_team,
    col_instagram,
    col_notes
  ];

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
  if (csv.fieldnames.indexOf(col_platform) <= csv.fieldnames.indexOf(col_day)) {
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
      let rowstr = displayNumber(i + 2, language);

      // Start building the error string early, since it's repeated a lot.
      let errprefix = "Invalid " + fieldname + " '" + val + "' in row " + rowstr + ": ";

      if (fieldname === col_day) {
        // Default to 1.
        if (val === "") {
          entry.day = 1;
        } else {
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
        }
      } else if (fieldname === col_platform) {
        // Default to 1.
        if (val === "") {
          entry.platform = 1;
        } else {
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
        }
      } else if (fieldname === col_flight) {
        // Default to A.
        if (val === "") {
          entry.flight = "A";
        } else {
          try {
            entry.flight = delocalizeFlight(val, language);
          } catch (err) {
            return errprefix + "expected a valid flight";
          }
        }
      } else if (fieldname === col_name) {
        if (val === "") {
          return errprefix + "every lifter needs a Name";
        }
        entry.name = val;
      } else if (fieldname === col_sex) {
        try {
          entry.sex = delocalizeSex(val, language);
        } catch (err) {
          return errprefix + "valid values are M, F, and Mx";
        }
      } else if (fieldname === col_equipment) {
        try {
          entry.equipment = delocalizeEquipment(val, language);
        } catch (err) {
          return errprefix + "valid values are 'Bare', 'Sleeves', 'Wraps', 'Single-ply', and 'Multi-ply'";
        }
      } else if (
        fieldname === col_division1 ||
        fieldname === col_division2 ||
        fieldname === col_division3 ||
        fieldname === col_division4 ||
        fieldname === col_division5
      ) {
        if (val === "") {
          // Only the first Division is mandatory.
          if (fieldname === col_division1) {
            return errprefix + "the first division is mandatory";
          }
        } else {
          // Check that it appears as a valid division.
          if (!state.meet.divisions.includes(val)) {
            return errprefix + "not a valid division per the Meet Setup page";
          }

          // Check that it wasn't already added.
          if (entry.divisions.includes(val)) {
            return errprefix + "the lifter is already in that Division";
          }

          entry.divisions.push(val);
        }
      } else if (
        fieldname === col_event1 ||
        fieldname === col_event2 ||
        fieldname === col_event3 ||
        fieldname === col_event4 ||
        fieldname === col_event5
      ) {
        if (val === "") {
          // Only the first Event is mandatory.
          if (fieldname === col_event1) {
            return errprefix + "the first event is mandatory";
          }
        } else {
          try {
            const evt = delocalizeEvent(val, language);

            // Check for duplicates.
            if (entry.events.includes(evt)) {
              return errprefix + "the lifter is already registered for that Event";
            }
            entry.events.push(evt);
          } catch (err) {
            return errprefix + "should be formed like 'SBD', 'BD', 'B', etc.";
          }
        }
      } else if (fieldname === col_birthdate) {
        // BirthDate is optional.
        if (val !== "") {
          const bd = parseDate(val);
          if (typeof bd !== "string") {
            let e = "date must be in the unambiguous international standard: YYYY-MM-DD";
            return errprefix + e;
          }

          entry.birthDate = bd;
        }
      } else if (fieldname === col_memberid) {
        entry.memberId = val;
      } else if (fieldname === col_country) {
        entry.country = val;
      } else if (fieldname === col_state) {
        entry.state = val;
      } else if (fieldname === col_lot) {
        // Empty strings are allowed: just doesn't use lots.
        if (val !== "") {
          const integer = parseInteger(val);
          if (typeof integer !== "number" || integer < 1) {
            return errprefix + "expected an empty cell or a positive integer";
          }

          // All checks passed!
          entry.lot = integer;
        }
      } else if (fieldname === col_team) {
        entry.team = val;
      } else if (fieldname === col_instagram) {
        entry.instagram = val;
      } else if (fieldname === col_notes) {
        entry.notes = val;
      } else {
        return 'Missing handler for the "' + fieldname + '" column';
      }
    }
  }

  return entries;
};
