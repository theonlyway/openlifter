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

import { validateIso8601Date } from "./iso8601Date";

describe("validateIso8601Date", () => {
  it("doesn't accept undefined", () => {
    expect(validateIso8601Date(undefined)).toEqual("error");
  });

  it("allows the empty string", () => {
    expect(validateIso8601Date("")).toEqual(null);
  });

  it("disallows malformed dates", () => {
    expect(validateIso8601Date("20190405")).toEqual("error");
    expect(validateIso8601Date("2019-0405")).toEqual("error");
    expect(validateIso8601Date("201904-05")).toEqual("error");
    expect(validateIso8601Date("04-05-2019")).toEqual("error");
    expect(validateIso8601Date("2019-04-05-")).toEqual("error");
    expect(validateIso8601Date("2019-04-05-06")).toEqual("error");
    expect(validateIso8601Date("2019-4-5")).toEqual("error");
    expect(validateIso8601Date("2019-14-05")).toEqual("error");
    expect(validateIso8601Date("2019-04-45")).toEqual("error");
    expect(validateIso8601Date("0019-04-15")).toEqual("error");
    expect(validateIso8601Date("2019-4a-15")).toEqual("error");
    expect(validateIso8601Date("2019-04-1b")).toEqual("error");
    expect(validateIso8601Date("--")).toEqual("error");
    expect(validateIso8601Date("0000-00-00")).toEqual("error");
    expect(validateIso8601Date("2019-00-01")).toEqual("error");
    expect(validateIso8601Date("2019-01-00")).toEqual("error");
    expect(validateIso8601Date(" 999-10-03")).toEqual("error");
    expect(validateIso8601Date("2019- 2-03")).toEqual("error");
    expect(validateIso8601Date("2019-02- 3")).toEqual("error");
    expect(validateIso8601Date(" 2019-02-03")).toEqual("error");
    expect(validateIso8601Date("2019-02-03 ")).toEqual("error");
  });

  it("allows well-formed dates", () => {
    expect(validateIso8601Date("2019-04-05")).toEqual("success");
    expect(validateIso8601Date("2019-01-01")).toEqual("success");
    expect(validateIso8601Date("1989-12-31")).toEqual("success");
  });
});
