// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Defines the calculation of Glossbrenner points.
// Taken from https://gitlab.com/openpowerlifting/opl-data.

import { schwartz_coefficient, malone_coefficient } from "./schwartzmalone";
import { wilksMen, wilksWomen } from "./wilks";

import type { Sex } from "../reducers/registrationReducer";

const glossbrenner_coefficient_men = (bodyweightKg: number): number => {
  // Glossbrenner is defined piecewise.
  if (bodyweightKg < 153.05) {
    return (schwartz_coefficient(bodyweightKg) + wilksMen(bodyweightKg)) / 2.0;
  } else {
    // Linear coefficients found by fitting to a table.
    const A = -0.000821668402557;
    const B = 0.676940740094416;
    return (schwartz_coefficient(bodyweightKg) + A * bodyweightKg + B) / 2.0;
  }
};

const glossbrenner_coefficient_women = (bodyweightKg: number): number => {
  // Glossbrenner is defined piecewise.
  if (bodyweightKg < 106.3) {
    return (malone_coefficient(bodyweightKg) + wilksWomen(bodyweightKg)) / 2.0;
  } else {
    // Linear coefficients found by fitting to a table.
    const A = -0.000313738002024;
    const B = 0.852664892884785;
    return (malone_coefficient(bodyweightKg) + A * bodyweightKg + B) / 2.0;
  }
};

// Calculates Glossbrenner points.
//
// Glossbrenner is the average of two older systems, Schwartz-Malone and Wilks,
// with a piecewise linear section.
//
// This points system is most often used by GPC affiliates.
export const glossbrenner = (sex: Sex, bodyweightKg: number, totalKg: number): number => {
  switch (sex) {
    case "M":
      return glossbrenner_coefficient_men(bodyweightKg) * totalKg;
    case "F":
      return glossbrenner_coefficient_women(bodyweightKg) * totalKg;
    default:
      return 0;
  }
};
