// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

import type { Sex } from "../../types/dataTypes";

// Calculated the Schwartz coefficient, used for men.
export const schwartz_coefficient = (bodyweightKg: number): number => {
  // Values calculated by fitting to coefficient tables.
  const A = 3565.902903983125;
  const B = -2.244917050872728;
  const C = 0.445775838479913;

  // Arbitrary choice of lower bound.
  let adjusted = Math.max(bodyweightKg, 40.0);

  return A * Math.pow(adjusted, B) + C;
};

// Calculates the Malone coefficient, used for women.
export const malone_coefficient = (bodyweightKg: number): number => {
  // Values calculated by fitting to coefficient tables.
  const A = 106.011586323613;
  const B = -1.293027130579051;
  const C = 0.322935585328304;

  // Lower bound chosen at point where Malone = max(Wilks).
  let adjusted = Math.max(bodyweightKg, 29.24);

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
