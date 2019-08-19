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

// Defines the calculation of Reshel points.
//
// Reshel is published as a table, with rounded x-values and rounded y-values.
// No formula is given. We attempted to fit a function to the curve.
//
// The formula here is accurate to about 0.01, and is most inaccurate between
// 70-80kg for men. Elsewhere it fits very closely.

import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

export function reshelMen(bodyweightKg: number): number {
  // Coefficients determined by GNUPlot. They need improvement.
  const a: number = 23740.8329088123;
  const b: number = -9.75618720662844;
  const c: number = 0.787990994925928;
  const d: number = -2.68445158813578;

  const normalized = Math.min(Math.max(bodyweightKg, 50.0), 174.75);
  return a * Math.pow(normalized + b, d) + c;
}

export function reshelWomen(bodyweightKg: number): number {
  // Coefficients determined by GNUPlot. They need improvement.
  const a: number = 239.894659799145;
  const b: number = -20.5105859285582;
  const c: number = 1.16052601684125;
  const d: number = -1.61417872668708;

  const normalized = Math.min(Math.max(bodyweightKg, 40.0), 118.75);
  return a * Math.pow(normalized + b, d) + c;
}

export const reshel = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
    case "Mx":
      return reshelMen(bodyweightKg) * totalKg;
    case "F":
      return reshelWomen(bodyweightKg) * totalKg;
    default:
      checkExhausted(sex);
      return 0;
  }
};
