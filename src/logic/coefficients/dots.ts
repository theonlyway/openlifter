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

// Defines the calculation of Dots points.
//
// Dots were introduced by the German IPF Affiliate BVDK after the IPF switched to
// IPF Points, which do not allow comparing between sexes. The BVDK hosts team
// competitions that allow lifters of all sexes to compete on a singular team.
//
// Since Wilks points have been ostracized from the IPF, and IPF Points are
// unsuitable, German lifters therefore came up with their own formula.
//
// The author of the Dots formula is Tim Konertz <tim.konertz@outlook.com>.
//
// Tim says that Dots is an acronym for "Dynamic Objective Team Scoring,"
// but that they chose the acronym before figuring out the expansion.
//
// Implementation taken from the main OpenPowerlifting repo, also AGPLv3+.

import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

function dotsPoly(a: number, b: number, c: number, d: number, e: number, x: number): number {
  const x2 = x * x;
  const x3 = x2 * x;
  const x4 = x3 * x;
  return 500.0 / (a * x4 + b * x3 + c * x2 + d * x + e);
}

export function dotsMen(bodyweightKg: number): number {
  const A = -0.000001093;
  const B = 0.0007391293;
  const C = -0.1918759221;
  const D = 24.0900756;
  const E = -307.75076;

  const adjusted = Math.max(Math.min(bodyweightKg, 210.0), 40.0);
  return dotsPoly(A, B, C, D, E, adjusted);
}

export function dotsWomen(bodyweightKg: number): number {
  const A = -0.0000010706;
  const B = 0.0005158568;
  const C = -0.1126655495;
  const D = 13.6175032;
  const E = -57.96288;

  const adjusted = Math.max(Math.min(bodyweightKg, 150.0), 40.0);
  return dotsPoly(A, B, C, D, E, adjusted);
}

export const dots = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  if (bodyweightKg === 0 || totalKg === 0) {
    return 0.0;
  }

  switch (sex) {
    case "M":
    case "Mx":
      return dotsMen(bodyweightKg) * totalKg;
    case "F":
      return dotsWomen(bodyweightKg) * totalKg;
    default:
      checkExhausted(sex);
      return 0;
  }
};
