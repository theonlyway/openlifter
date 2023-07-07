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

// Defines the calculation of Wilks points.
// Taken from https://gitlab.com/openpowerlifting/ipf-points-calculator.

import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

function wilksPoly(a: number, b: number, c: number, d: number, e: number, f: number, x: number): number {
  const x2 = x * x;
  const x3 = x2 * x;
  const x4 = x3 * x;
  const x5 = x4 * x;
  return 500.0 / (a + b * x + c * x2 + d * x3 + e * x4 + f * x5);
}

export function wilksMen(bodyweightKg: number): number {
  const normalized = Math.min(Math.max(bodyweightKg, 40.0), 201.9);
  return wilksPoly(-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8, normalized);
}

export function wilksWomen(bodyweightKg: number): number {
  const normalized = Math.min(Math.max(bodyweightKg, 26.51), 154.53);
  return wilksPoly(
    594.31747775582,
    -27.23842536447,
    0.82112226871,
    -0.00930733913,
    0.00004731582,
    -0.00000009054,
    normalized,
  );
}

export const wilks = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
    case "Mx":
      return wilksMen(bodyweightKg) * totalKg;
    case "F":
      return wilksWomen(bodyweightKg) * totalKg;
    default:
      checkExhausted(sex);
      return 0;
  }
};
