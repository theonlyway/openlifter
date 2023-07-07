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

// Defines the calculation of Wilks 2020 points.

import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

function wilks2020Poly(a: number, b: number, c: number, d: number, e: number, f: number, x: number): number {
  const x2 = x * x;
  const x3 = x2 * x;
  const x4 = x3 * x;
  const x5 = x4 * x;
  return 600.0 / (a + b * x + c * x2 + d * x3 + e * x4 + f * x5);
}

export function wilks2020Men(bodyweightKg: number): number {
  const normalized = Math.min(Math.max(bodyweightKg, 40.0), 200.95);
  return wilks2020Poly(
    47.4617885411949,
    8.47206137941125,
    0.073694103462609,
    -0.00139583381094385,
    0.00000707665973070743,
    -0.0000000120804336482315,
    normalized,
  );
}

export function wilks2020Women(bodyweightKg: number): number {
  const normalized = Math.min(Math.max(bodyweightKg, 40.0), 150.95);
  return wilks2020Poly(
    -125.425539779509,
    13.7121941940668,
    -0.0330725063103405,
    -0.0010504000506583,
    0.00000938773881462799,
    -0.000000023334613884954,
    normalized,
  );
}

export const wilks2020 = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
    case "Mx":
      return wilks2020Men(bodyweightKg) * totalKg;
    case "F":
      return wilks2020Women(bodyweightKg) * totalKg;
    default:
      checkExhausted(sex);
      return 0;
  }
};
