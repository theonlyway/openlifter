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
import { lbs2kg } from "../../logic/units";

export const randomString = (): string => {
  // Converts each digit to a value in base 36.
  return Math.random().toString(36).substr(2);
};

// Generate a random integer between max and min, inclusive.
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

export const randomAttemptWithMin = (inKg: boolean, min: number) => {
  const multiple = 2.5;
  if (inKg) {
    return Math.floor(randomFixedPoint(min, 360, 1) / multiple) * multiple;
  } else {
    return lbs2kg(Math.floor(randomFixedPoint(min, 800, 1) / multiple) * multiple);
  }
};

export const randomAttempt = (inKg: boolean) => {
  const min = inKg ? 25 : 55;
  return randomAttemptWithMin(inKg, min);
};

// Randomly shuffle an array in-place using the Fisher-Yates algorithm.
//
// For each element, swap it with a randomly-chosen element of greater or equal index.
export const shuffle = <T>(array: Array<Readonly<T>>): void => {
  const numElements = array.length;

  for (let i = 0; i < numElements - 1; i++) {
    // Randomly select an element of greater or equal index.
    const switchIndex = randomInt(i, numElements - 1);

    // Swap the two elements.
    const temp = array[i];
    array[i] = array[switchIndex];
    array[switchIndex] = temp;
  }
};
