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

// Exports registration data to a CSV file.

import { csvDate, csvString, Csv } from "./csv";
import { getString, localizeEquipment, localizeEvent, localizeFlight, localizeSex } from "../strings";

import { Language } from "../../types/dataTypes";
import { RegistrationState } from "../../types/stateTypes";

const boolToYesNo = (b: boolean, language: Language): string => {
  if (b === true) {
    return getString("common.response-yes", language);
  }
  return getString("common.response-no", language);
};

export const makeRegistrationsCsv = (registration: RegistrationState, language: Language): string => {
  const csv = new Csv();

  const division_template = getString("import.column-division-n", language);
  const event_template = getString("import.column-event-n", language);

  const col_day = getString("import.column-day", language);
  const col_platform = getString("import.column-platform", language);
  const col_flight = getString("import.column-flight", language);
  const col_name = getString("import.column-name", language);
  const col_sex = getString("import.column-sex", language);
  const col_equipment = getString("import.column-equipment", language);
  const col_division1 = division_template.replace("{N}", "1");
  const col_event1 = event_template.replace("{N}", "1");
  const col_birthdate = getString("import.column-birthdate", language);
  const col_age = getString("import.column-age", language);
  const col_squatRackInfo = getString("import.column-squatRack", language);
  const col_benchRackInfo = getString("import.column-benchRack", language);
  const col_memberid = getString("import.column-memberid", language);
  const col_country = getString("import.column-country", language);
  const col_state = getString("import.column-state", language);
  const col_lot = getString("import.column-lot", language);
  const col_guest = getString("import.column-guest", language);
  const col_team = getString("import.column-team", language);
  const col_instagram = getString("import.column-instagram", language);
  const col_notes = getString("import.column-notes", language);

  csv.appendColumns([col_day, col_platform, col_flight, col_name, col_sex, col_equipment]);
  csv.appendColumns([col_division1, col_event1]); // Base cases. Others inserted by need.
  csv.appendColumns([col_birthdate, col_age, col_squatRackInfo, col_benchRackInfo, col_memberid]);
  csv.appendColumns([col_country, col_state, col_lot, col_guest, col_team, col_instagram, col_notes]);

  for (let i = 0; i < registration.entries.length; ++i) {
    const entry = registration.entries[i];

    const row: Array<string> = new Array(csv.fieldnames.length).fill("");
    row[csv.index(col_day)] = csvString(entry.day);
    row[csv.index(col_platform)] = csvString(entry.platform);
    row[csv.index(col_flight)] = csvString(localizeFlight(entry.flight, language));
    row[csv.index(col_name)] = csvString(entry.name);
    row[csv.index(col_sex)] = csvString(localizeSex(entry.sex, language));
    row[csv.index(col_equipment)] = csvString(localizeEquipment(entry.equipment, language));
    row[csv.index(col_birthdate)] = csvDate(entry.birthDate);
    row[csv.index(col_age)] = csvString(entry.age);
    row[csv.index(col_squatRackInfo)] = csvString(entry.squatRackInfo);
    row[csv.index(col_benchRackInfo)] = csvString(entry.benchRackInfo);
    row[csv.index(col_memberid)] = csvString(entry.memberId);
    row[csv.index(col_country)] = csvString(entry.country);
    row[csv.index(col_state)] = csvString(entry.state);
    row[csv.index(col_lot)] = csvString(entry.lot);
    row[csv.index(col_guest)] = csvString(boolToYesNo(entry.guest, language));
    row[csv.index(col_team)] = csvString(entry.team);
    row[csv.index(col_instagram)] = csvString(entry.instagram);
    row[csv.index(col_notes)] = csvString(entry.notes);

    // Divisions.
    for (let j = 0; j < entry.divisions.length; ++j) {
      const division: string = entry.divisions[j];
      const column: string = division_template.replace("{N}", String(j + 1));

      // Create the column if necessary. The previously numbered column exists.
      if (csv.index(column) === -1) {
        const prevIndex = csv.index(division_template.replace("{N}", String(j)));
        csv.insertColumn(prevIndex + 1, column); // Make space in other rows.
        row.splice(prevIndex + 1, 0, ""); // Make space in this row.
      }
      row[csv.index(column)] = csvString(division);
    }

    // Events.
    for (let j = 0; j < entry.events.length; ++j) {
      const event = entry.events[j];
      const column: string = event_template.replace("{N}", String(j + 1));

      // Create the column if necessary. The previously numbered column exists.
      if (csv.index(column) === -1) {
        const prevIndex = csv.index(event_template.replace("{N}", String(j)));
        csv.insertColumn(prevIndex + 1, column); // Make space in other rows.
        row.splice(prevIndex + 1, 0, ""); // Make space in this row.
      }
      row[csv.index(column)] = csvString(localizeEvent(event, language));
    }

    csv.rows.push(row);
  }

  return csv.toString();
};
