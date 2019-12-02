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

import { parseInteger, parseEvent, parseDate } from "./parsers";

describe("parseInteger", () => {
  it("successfully parses integers", () => {
    expect(parseInteger("0")).toEqual(0);
    expect(parseInteger("1")).toEqual(1);
    expect(parseInteger("3965")).toEqual(3965);
    expect(parseInteger("-237")).toEqual(-237);
  });

  it("fails on floating-point numbers", () => {
    expect(parseInteger("0.0")).toEqual(undefined);
    expect(parseInteger("1.0")).toEqual(undefined);
    expect(parseInteger("1.")).toEqual(undefined);
    expect(parseInteger("-1.0")).toEqual(undefined);
  });

  it("fails on non-numbers", () => {
    expect(parseInteger("")).toEqual(undefined);
    expect(parseInteger("--237")).toEqual(undefined);
    expect(parseInteger("237-")).toEqual(undefined);
    expect(parseInteger(" 237")).toEqual(undefined);
    expect(parseInteger("23 7")).toEqual(undefined);
    expect(parseInteger("kittens")).toEqual(undefined);
    expect(parseInteger("0xCAFE")).toEqual(undefined);
    expect(parseInteger("1..0")).toEqual(undefined);
  });
});

describe("parseEvent", () => {
  it("parses valid Events", () => {
    expect(parseEvent("SBD")).toEqual("SBD");
    expect(parseEvent("SB")).toEqual("SB");
    expect(parseEvent("SD")).toEqual("SD");
    expect(parseEvent("BD")).toEqual("BD");
    expect(parseEvent("S")).toEqual("S");
    expect(parseEvent("B")).toEqual("B");
    expect(parseEvent("D")).toEqual("D");
  });

  it("fails on invalid Events", () => {
    expect(parseEvent("")).toEqual(undefined);
    expect(parseEvent("floof")).toEqual(undefined);
    expect(parseEvent("SSS")).toEqual(undefined);
    expect(parseEvent("DMX")).toEqual(undefined);
    expect(parseEvent("SBBD")).toEqual(undefined);
    expect(parseEvent("DBS")).toEqual(undefined);
    expect(parseEvent("DB")).toEqual(undefined);
  });
});

describe("parseDate", () => {
  it("parses valid Dates", () => {
    expect(typeof parseDate("1999-01-05")).toEqual("string");
    expect(typeof parseDate("2012-12-31")).toEqual("string");
  });

  it("rejects malformed Dates", () => {
    expect(typeof parseDate("19999-01-05")).toEqual("undefined");
    expect(typeof parseDate("0000-01-05")).toEqual("undefined");
    expect(typeof parseDate("1999-00-05")).toEqual("undefined");
    expect(typeof parseDate("1999-01-00")).toEqual("undefined");
    expect(typeof parseDate("1999-13-05")).toEqual("undefined");
    expect(typeof parseDate("1999-01-52")).toEqual("undefined");
    expect(typeof parseDate("999-01-52")).toEqual("undefined");
    expect(typeof parseDate("1999-1-52")).toEqual("undefined");
    expect(typeof parseDate("1999-01-5")).toEqual("undefined");
  });

  // Dates of this kind are emitted by csvDate() in CSV files.
  it("parses dates formatted to avoid Excel stupidity", () => {
    expect(typeof parseDate("'1999-01-05")).toEqual("string");
    expect(typeof parseDate("'2012-12-31")).toEqual("string");
  });
});
