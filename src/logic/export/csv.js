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

// Defines a general CSV manipulation class.
// This is a JS port of the Python "oplcsv.py" library used by the OpenPowerlifting
// main data project.

// Makes a string suitable for inclusion in a simple CSV file,
// by deleting all commas and double quotes.
export const csvString = (x: number | string): string => {
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

// A class for managing simple CSV files. Double-quotes and commas are disallowed.
export class Csv {
  fieldnames: Array<string>; // Column names.
  rows: Array<Array<string>>; // Individual rows.

  constructor() {
    this.fieldnames = [];
    this.rows = [];
  }

  length(): number {
    return this.rows.length;
  }

  index(name: string): number {
    return this.fieldnames.indexOf(name);
  }

  appendColumn(name: string): void {
    this.fieldnames.push(name);
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].push("");
    }
  }

  appendColumns(namelist: Array<string>): void {
    this.fieldnames = this.fieldnames.concat(namelist);
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < namelist.length; j++) {
        this.rows[i].push("");
      }
    }
  }

  insertColumn(index: number, name: string): void {
    this.fieldnames.splice(index, 0, name);
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].splice(index, 0, "");
    }
  }

  removeColumnByIndex(index: number): void {
    this.fieldnames.splice(index, 1);
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].splice(index, 1);
    }
  }

  removeColumnByName(name: string): void {
    for (let i = 0; i < this.fieldnames.length; i++) {
      if (this.fieldnames[i] === name) {
        this.removeColumnByIndex(i);
        return;
      }
    }
  }

  removeEmptyColumns(): void {
    for (let i = 0; i < this.fieldnames.length; i++) {
      let empty = true;
      for (let j = 0; j < this.rows.length; j++) {
        if (this.rows[j][i] !== "") {
          empty = false;
          break;
        }
      }
      if (empty === true) {
        this.removeColumnByIndex(i);
        this.removeEmptyColumns();
        return;
      }
    }
  }

  toString(): string {
    const headers = this.fieldnames.join(",");
    let strRows: Array<string> = [];
    for (let i = 0; i < this.rows.length; i++) {
      strRows.push(this.rows[i].join(","));
    }
    return headers + "\n" + strRows.join("\n") + "\n";
  }
}
