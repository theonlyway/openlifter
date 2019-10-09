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

import { displayWeight, displayWeightOnePlace, kg2lbs, lbs2kg } from "./units";

describe("displayWeight", () => {
  it("rounds to two decimal places", () => {
    expect(displayWeight(5.77777)).toEqual("5.78");
  });

  it("truncates extraneous zeros", () => {
    expect(displayWeight(0.0)).toEqual("0");
    expect(displayWeight(125.0)).toEqual("125");
    expect(displayWeight(127.5)).toEqual("127.5");
    expect(displayWeight(127.5)).toEqual("127.5");
    expect(displayWeight(127.05)).toEqual("127.05");
  });

  // These tests are ported from modules/opltypes/src/weightkg.rs.
  it("matches OpenPowerlifting WeightKg tests", () => {
    // test_weightkg_rounding()
    expect(displayWeight(123.456)).toEqual("123.46");
    expect(displayWeight(-123.456)).toEqual("-123.46");

    // test_weightkg_as_lbs_rounding()
    expect(displayWeight(kg2lbs(775.64))).toEqual("1710");
    expect(displayWeight(kg2lbs(775.65))).toEqual("1710.02");
    expect(displayWeight(kg2lbs(197.31))).toEqual("435");
    expect(displayWeight(kg2lbs(109.04))).toEqual("240.4");
    expect(displayWeight(kg2lbs(317.5))).toEqual("699.97");
  });

  it("plausibly lets you input pounds without messing it up", () => {
    // 350lbs is 158.7573296331324, an inexact value.
    const as_kg = lbs2kg(350);
    expect(displayWeight(kg2lbs(as_kg))).toEqual("350");
  });
});

describe("displayWeightOnePlace", () => {
  it("rounds to one decimal places", () => {
    expect(displayWeightOnePlace(5.77777)).toEqual("5.7");
  });

  it("truncates extraneous zeros", () => {
    expect(displayWeightOnePlace(0.0)).toEqual("0");
    expect(displayWeightOnePlace(125.0)).toEqual("125");
    expect(displayWeightOnePlace(127.5)).toEqual("127.5");
    expect(displayWeightOnePlace(127.08)).toEqual("127");
  });

  it("rounds like OpenPowerlifting (truncation)", () => {
    expect(displayWeightOnePlace(kg2lbs(317.5))).toEqual("699.9");
  });
});
