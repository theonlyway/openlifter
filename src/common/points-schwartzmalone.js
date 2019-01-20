// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Defines the calculation of Schwartz-Malone points.
// Taken from https://gitlab.com/openpowerlifting/opl-data.

import type { Sex } from "../reducers/registrationReducer";

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
