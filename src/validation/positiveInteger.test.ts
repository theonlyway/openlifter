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

import { validatePositiveInteger } from "./positiveInteger";

describe("validatePositiveInteger", () => {
  it("doesn't accept undefined or null", () => {
    expect(validatePositiveInteger(undefined)).toEqual("error");
    expect(validatePositiveInteger(null as any)).toEqual("error");
  });

  it("allows the empty string", () => {
    expect(validatePositiveInteger("")).toEqual(null);
  });

  it("disallows non-integers", () => {
    expect(validatePositiveInteger("20.5")).toEqual("error");
    expect(validatePositiveInteger("NaN")).toEqual("error");
    expect(validatePositiveInteger("Infinity")).toEqual("error");
    expect(validatePositiveInteger("abc")).toEqual("error");
    expect(validatePositiveInteger("200b")).toEqual("error");
    expect(validatePositiveInteger("   200")).toEqual("error");
    expect(validatePositiveInteger("200 ")).toEqual("error");
  });

  it("disallows non-positive integers", () => {
    expect(validatePositiveInteger("0")).toEqual("error");
    expect(validatePositiveInteger("0000000")).toEqual("error");
    expect(validatePositiveInteger("-5")).toEqual("error");
    expect(validatePositiveInteger("-500")).toEqual("error");
  });

  it("disallows unnecessary decimal notation", () => {
    expect(validatePositiveInteger("200.0")).toEqual("error");
    expect(validatePositiveInteger("200.")).toEqual("error");
  });

  it("disallows integers prefixed by unnecessary zeros", () => {
    expect(validatePositiveInteger("02")).toEqual("error");
    expect(validatePositiveInteger("002")).toEqual("error");
  });

  it("allows integers", () => {
    expect(validatePositiveInteger("1")).toEqual("success");
    expect(validatePositiveInteger("20")).toEqual("success");
    expect(validatePositiveInteger("2000")).toEqual("success");
  });

  it("respects the inclusiveMax", () => {
    expect(validatePositiveInteger("2", 1)).toEqual("error");
    expect(validatePositiveInteger("2", 2)).toEqual("success");
    expect(validatePositiveInteger("2", 3)).toEqual("success");
  });
});
