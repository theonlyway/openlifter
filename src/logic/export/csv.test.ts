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

import { Csv, getSpreadsheetColumnName } from "./csv";

describe("getSpreadsheetColumnName", () => {
  it("uses the standard alphabet", () => {
    // Single-character columns.
    expect(getSpreadsheetColumnName(0)).toEqual("A");
    expect(getSpreadsheetColumnName(1)).toEqual("B");
    expect(getSpreadsheetColumnName(2)).toEqual("C");
    expect(getSpreadsheetColumnName(24)).toEqual("Y");
    expect(getSpreadsheetColumnName(25)).toEqual("Z");

    // Double-character columns.
    expect(getSpreadsheetColumnName(26 * 1 + 0)).toEqual("AA");
    expect(getSpreadsheetColumnName(26 * 1 + 1)).toEqual("AB");
    expect(getSpreadsheetColumnName(26 * 1 + 2)).toEqual("AC");
    expect(getSpreadsheetColumnName(26 * 1 + 24)).toEqual("AY");
    expect(getSpreadsheetColumnName(26 * 1 + 25)).toEqual("AZ");

    expect(getSpreadsheetColumnName(26 * 2 + 0)).toEqual("BA");
    expect(getSpreadsheetColumnName(26 * 2 + 1)).toEqual("BB");
    expect(getSpreadsheetColumnName(26 * 2 + 2)).toEqual("BC");
    expect(getSpreadsheetColumnName(26 * 2 + 25)).toEqual("BZ");

    expect(getSpreadsheetColumnName(26 * 26 + 0)).toEqual("ZA");
    expect(getSpreadsheetColumnName(26 * 26 + 25)).toEqual("ZZ");

    // Three-character columns.
    expect(getSpreadsheetColumnName(26 * 26 * 1 + 26 * 1 + 0)).toEqual("AAA");
    expect(getSpreadsheetColumnName(26 * 26 * 1 + 26 * 1 + 1)).toEqual("AAB");
    expect(getSpreadsheetColumnName(26 * 26 * 1 + 26 * 2 + 0)).toEqual("ABA");
    expect(getSpreadsheetColumnName(26 * 26 * 2 + 26 * 1 + 0)).toEqual("BAA");
  });
});

describe("Csv", () => {
  it("completes a fromString() -> toString() round-trip", () => {
    const csv = new Csv();
    const basic = "Foo,Bar,Baz\n1,2,3\n4,5,6\n";
    expect(csv.fromString(basic).toString()).toEqual(basic);
  });

  // Error message strings are returned on failure.
  it("fails fromString() if wonky stuff is going on", () => {
    const csv = new Csv();

    const missing_header = "Foo,,Baz\n1,2,3\n";
    expect(typeof csv.fromString(missing_header)).toEqual("string");

    const uses_doublequotes = 'Foo,"Bar",Baz\n1,2,3\n';
    expect(typeof csv.fromString(uses_doublequotes)).toEqual("string");

    const too_many_headers = "Foo,Bar,Baz,Zap\n1,2,3\n";
    expect(typeof csv.fromString(too_many_headers)).toEqual("string");

    const malformed_row = "Foo,Bar,Baz\n\n1,2,3\n";
    expect(typeof csv.fromString(malformed_row)).toEqual("string");

    const malformed_row_2 = "Foo,Bar,Baz\n1,2\n";
    expect(typeof csv.fromString(malformed_row_2)).toEqual("string");

    const malformed_row_3 = "Foo,Bar,Baz\n1,2,3\n4,5\n";
    expect(typeof csv.fromString(malformed_row_3)).toEqual("string");
  });
});
