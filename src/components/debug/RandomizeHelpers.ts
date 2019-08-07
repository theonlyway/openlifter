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

// Common functions shared by the Randomize feature.

// Generate a gibberish string, between 0-11 characters.
export const randomString = (): string => {
  // Converts each digit to a value in base 36.
  return Math.random()
    .toString(36)
    .substr(2);
};

// Generate a random integer between max and min.
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random floating-point number with a set number of fractional digits.
export const randomFixedPoint = (min: number, max: number, fixedPoints: number) => {
  const power = Math.pow(10, fixedPoints);

  // Construct an integer from [0, (max - min + 1) * 10^fixedPoints].
  const k = Math.floor(Math.random() * (max - min + 1) * power);

  // Translate it back to normal space.
  return k / power + min;
};
