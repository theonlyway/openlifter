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

// Defines operations for converting between different units, usually
// pounds and kg.

export const kg2lbs = (kg: number): number => {
  return kg * 2.20462262;
};

export const lbs2kg = (lbs: number): number => {
  return lbs / 2.20462262;
};

// Renders a weight (kg or lbs) for display, rounding to two decimal places,
// hiding unnecessary zeros on the right.
//
// This rounding behavior eliminates all the visual inconsistencies of lbs->kg
// conversion -- for example, how 112.5lbs isn't representable exactly in kg.
export const displayWeight = (weight: number, lang?: string): string => {
  const locale = lang === undefined ? "en" : lang;
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 2 }).format(weight);
};

// Renders a weight (kg or lbs) for display, rounding to one decimal place.
// hiding unnecessary zeros on the right.
export const displayWeightOnePlace = (weight: number, lang?: string): string => {
  const locale = lang === undefined ? "en" : lang;
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 1 }).format(weight);
};
