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

import { csvString, Csv } from "./csv";

import { Entry, Event } from "../../types/dataTypes";
import { RegistrationState } from "../../types/stateTypes";

export const makeRegistrationsCsv = (registration: RegistrationState): string => {
  let csv = new Csv();

  csv.appendColumns(["Day", "Platform", "Flight", "Name", "Sex", "Equipment"]);
  csv.appendColumns(["Division1", "Event1"]); // Base cases. Others inserted by need.
  csv.appendColumns(["BirthDate", "MemberID", "Country", "State", "Lot", "Team"]);
  csv.appendColumns(["Instagram", "Notes"]);

  for (let i = 0; i < registration.entries.length; ++i) {
    const entry = registration.entries[i];

    let row: Array<string> = new Array(csv.fieldnames.length).fill("");
    row[csv.index("Day")] = csvString(entry.day);
    row[csv.index("Platform")] = csvString(entry.platform);
    row[csv.index("Flight")] = csvString(entry.flight);
    row[csv.index("Name")] = csvString(entry.name);
    row[csv.index("Sex")] = csvString(entry.sex);
    row[csv.index("Equipment")] = csvString(entry.equipment);
    row[csv.index("BirthDate")] = csvString(entry.birthDate);
    row[csv.index("MemberID")] = csvString(entry.memberId);
    row[csv.index("Country")] = csvString(entry.country);
    row[csv.index("State")] = csvString(entry.state);
    row[csv.index("Lot")] = csvString(entry.lot);
    row[csv.index("Team")] = csvString(entry.team);
    row[csv.index("Instagram")] = csvString(entry.instagram);
    row[csv.index("Notes")] = csvString(entry.notes);

    // Divisions.
    for (let j = 0; j < entry.divisions.length; ++j) {
      const division: string = entry.divisions[j];
      const column: string = "Division" + String(j + 1);

      // Create the column if necessary. The previously numbered column exists.
      if (csv.index(column) === -1) {
        const prevIndex = csv.index("Division" + String(j));
        csv.insertColumn(prevIndex + 1, column); // Make space in other rows.
        row.splice(prevIndex + 1, 0, ""); // Make space in this row.
      }
      row[csv.index(column)] = csvString(division);
    }

    // Events.
    for (let j = 0; j < entry.events.length; ++j) {
      const event = entry.events[j];
      const column: string = "Event" + String(j + 1);

      // Create the column if necessary. The previously numbered column exists.
      if (csv.index(column) === -1) {
        const prevIndex = csv.index("Event" + String(j));
        csv.insertColumn(prevIndex + 1, column); // Make space in other rows.
        row.splice(prevIndex + 1, 0, ""); // Make space in this row.
      }
      row[csv.index(column)] = csvString(event);
    }

    csv.rows.push(row);
  }

  return csv.toString();
};
