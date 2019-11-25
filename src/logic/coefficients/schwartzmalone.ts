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

// Defines the calculation of Schwartz-Malone points.
// Taken from https://gitlab.com/openpowerlifting/opl-data.

import { Sex } from "../../types/dataTypes";

// Calculates the Schwartz coefficient, used for men.
//
// The Schwartz formula replaced the Hoffinan formula.
// Schwartz was proposed around February 1971.
//
// The exact formula was found in the magazine Powerlifting USA,
// Vol.6, No.2, August 1982, on page 61. That text is reproduced below:
//
// Computerized Schwartz Formula...Dr. Lyle Schwartz has often been
// asked for a means by which the formula he has given Powerlifting can be
// programmed into a computer or a hand held calculator with sufficient
// memory. To obtain the Schwartz Formula (SF) for bodyweights (BW) bet-
// ween 40 and 126 kg, the expression is: SF = 0.631926 exp(+01) -
// 0.262349 exp(+00) (BW) + 0.511550 exp(-02) (BW)^2 - 0.519738
// exp(-04) (BW)^3 + 0.267626 exp(-06) (BW)^4 - 0.540132 exp(-09)
// (BW)^5 - 0.728875 exp(-13) (BW)^6. For higher bodyweights, the follow-
// ing simple formulae are used: for BW 126-136, SF = 0.5210-0.0012
// (BW - 125), for BW 136-146, SF = 0.5090-0011 (BW - 135), for BW
// 146-156, SF = 0.4980-0.0010 (BW - 145), and for BW 156-166, SF =
// 0.4880-0.0090 (BW - 156)
//
// Schwartz is quoted as saying about the formula's development,
//
// "Since powerlifting was still a young sport in the early 1970s
// there was uneven development in the three lifts on the part of most
// self-trained athletes. I compensated for such unevenness by creating
// artificial 'best' totals by adding together the current records in the
// individual lifts. A 'best' total would have been achieved by that ideal
// lifter who could match the best performances to date in all three
// powerlifts. Then I fitted these data to an artificial curve and picked
// off numbers from the curve."
export const schwartz_coefficient = (bodyweightKg: number): number => {
  const adjusted = Math.min(Math.max(bodyweightKg, 40.0), 166.0);

  if (adjusted <= 126.0) {
    const x0 = 0.631926 * 10.0;
    const x1 = 0.262349 * adjusted;
    const x2 = 0.51155 * Math.pow(10.0, -2) * Math.pow(adjusted, 2);
    const x3 = 0.519738 * Math.pow(10.0, -4) * Math.pow(adjusted, 3);
    const x4 = 0.267626 * Math.pow(10.0, -6) * Math.pow(adjusted, 4);
    const x5 = 0.540132 * Math.pow(10.0, -9) * Math.pow(adjusted, 5);
    const x6 = 0.728875 * Math.pow(10.0, -13) * Math.pow(adjusted, 6);
    return x0 - x1 + x2 - x3 + x4 - x5 - x6;
  } else if (adjusted <= 136.0) {
    return 0.521 - 0.0012 * (adjusted - 125.0);
  } else if (adjusted <= 146.0) {
    return 0.509 - 0.0011 * (adjusted - 135.0);
  } else if (adjusted <= 156.0) {
    return 0.498 - 0.001 * (adjusted - 145.0);
  } else {
    // The final formula as published for this piece does not match
    // the coefficient tables.
    //
    // From the tables, the step is exactly 0.0004 per pound, which
    // has been converted to kg below.
    //
    // For reference, the published original is:
    //   0.4880 - 0.0090 * (adjusted - 156.0)
    return 0.4879 - 0.00088185 * (adjusted - 155.0);
  }
};

// Calculates the Malone coefficient, used for women.
export const malone_coefficient = (bodyweightKg: number): number => {
  // Values calculated by fitting to coefficient tables.
  const A = 106.011586323613;
  const B = -1.293027130579051;
  const C = 0.322935585328304;

  // Lower bound chosen at point where Malone = max(Wilks).
  const adjusted = Math.max(bodyweightKg, 29.24);

  return A * Math.pow(adjusted, B) + C;
};

// Calculates Schwartz-Malone points.
//
// Schwartz-Malone is an older system that was superseded by Wilks.
export const schwartzmalone = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
      return schwartz_coefficient(bodyweightKg) * totalKg;
    case "F":
      return malone_coefficient(bodyweightKg) * totalKg;
    default:
      return 0;
  }
};
