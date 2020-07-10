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

import { Entry, Language } from "../types/dataTypes";

// Defines operations for converting between different units, usually
// pounds and kg.

export const kg2lbs = (kg: number): number => {
  return kg * 2.20462262;
};

export const lbs2kg = (lbs: number): number => {
  return lbs / 2.20462262;
};

// Converts a displayed String to a Number, even if that string is localized.
export const string2number = (s: string): number => {
  return Number(s.replace(",", "."));
};

// Renders a weight (kg or lbs) for display, rounding to two decimal places,
// hiding unnecessary zeros on the right.
//
// This rounding behavior eliminates all the visual inconsistencies of lbs->kg
// conversion -- for example, how 112.5lbs isn't representable exactly in kg.
export const displayWeight = (weight: number, lang?: Language): string => {
  const locale = lang === undefined ? "en" : lang;

  // This matches the OpenPowerlifting WeightKg::as_lbs() conversion logic.
  // First, round to the hundredth place, stored as an integer.
  let rounded = Math.round(weight * 100);

  // If the fractional part is close to another tenth, add a correction.
  // This happens due to floating-point imprecision.
  if (rounded % 10 === 9) {
    // Add 0.01 (still stored as an integer).
    rounded += 1;
  }

  // Convert back to normal floating-point without truncation.
  rounded = rounded / 100;

  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 2 }).format(rounded);
};

// Renders a weight (kg or lbs) for display, truncating to one decimal place.
// hiding unnecessary zeros on the right.
export const displayWeightOnePlace = (weight: number, lang?: Language): string => {
  const locale = lang === undefined ? "en" : lang;

  // This matches the OpenPowerlifting WeightKg::as_lbs() conversion logic.
  // First, round to the hundredth place, stored as an integer.
  let rounded = Math.round(weight * 100);

  // If the fractional part is close to another tenth, add a correction.
  // This happens due to floating-point imprecision.
  if (rounded % 10 === 9) {
    // Add 0.01 (still stored as an integer).
    rounded += 1;
  }

  // Truncate to the tenth place, then convert back to normal floating-point.
  const truncated = Math.trunc(rounded / 10) / 10;

  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 1 }).format(truncated);
};

// Points display with two fixed decimal places (including zeros).
export const displayPoints = (points: number, lang: Language): string => {
  return new Intl.NumberFormat(lang, {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(points);
};

// Display a generic number that is neither a weight nor points.
// This is intended for things like ages, day numbers, etc.
export const displayNumber = (number: number, lang: Language): string => {
  // Grouping should not be used: otherwise ',' is ambiguous as a separator.
  return new Intl.NumberFormat(lang, { useGrouping: false }).format(number);
};

// Display an ordinal number representing a place.
// In Spanish, Portuguese, and Italian, the ordinal differs based on the lifter's Sex.
export const displayPlaceOrdinal = (number: number, entry: Entry, lang: Language): string => {
  switch (lang) {
    case "es":
    case "pt":
      return displayNumber(number, lang) + (entry.sex === "F" ? "ª" : "º");
    default:
      return displayNumber(number, lang);
  }
};
