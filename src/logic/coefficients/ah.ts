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

// Defines the calculation of AH points, used by ParaPL.
// Taken from https://gitlab.com/openpowerlifting/opl-data/blob/master/modules/coefficients/src/ah.rs

import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

// Calculates the AH coefficient for men.
//
// The full formula is defined in Excel:
//  =ROUND($AM$1/(POWER(LOG(I13),$AM$2))*M13,2)
//
// Where:
//  I13: Bodyweight
//  M13: Lift Attempt
//  AM1: 3.2695
//  AM2: 1.95
function ahMen(bodyweightKg: number): number {
  const AM1: number = 3.2695;
  const AM2: number = 1.95;

  const adjusted = Math.min(Math.max(bodyweightKg, 32.0), 157.0);

  return AM1 / Math.pow(Math.log10(adjusted), AM2);
}

// Calculates the AH coefficient for women.
//
// The full formula is defined in Excel:
//  =ROUND($AG$1/(POWER(LOG(I13),$AG$10))*M13,2)
//
// Where:
//  I13: Bodyweight
//  M13: Lift Attempt
//  AG1: 2.7566
//  AG10: 1.8
function ahWomen(bodyweightKg: number): number {
  const AG1: number = 2.7566;
  const AG10: number = 1.8;

  const adjusted = Math.min(Math.max(bodyweightKg, 28.0), 112.0);

  return AG1 / Math.pow(Math.log10(adjusted), AG10);
}

// Calculates AH (Haleczko) points, used in ParaPL bench-only meets.
export const ah = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
    case "Mx":
      return ahMen(bodyweightKg) * totalKg;
    case "F":
      return ahWomen(bodyweightKg) * totalKg;
    default:
      checkExhausted(sex);
      return 0;
  }
};
