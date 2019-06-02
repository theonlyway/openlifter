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

import { displayWeight, displayWeightOnePlace } from "./units";

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
});

describe("displayWeightOnePlace", () => {
  it("rounds to one decimal places", () => {
    expect(displayWeightOnePlace(5.77777)).toEqual("5.8");
  });

  it("truncates extraneous zeros", () => {
    expect(displayWeightOnePlace(0.0)).toEqual("0");
    expect(displayWeightOnePlace(125.0)).toEqual("125");
    expect(displayWeightOnePlace(127.5)).toEqual("127.5");
    expect(displayWeightOnePlace(127.08)).toEqual("127.1");
  });
});
