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

import { kg2lbs, displayWeight } from "../logic/units";

import { PlateColors } from "../constants/plateColors";

import { Plate, LoadedPlate } from "../types/dataTypes";

// Convert from kg to lbs with rounding to 2 decimal places.
// It's OK that this is slow, since it rarely executes.
const safeKg2Lbs = (kg: number): number => {
  return Number(displayWeight(kg2lbs(kg)));
};

// Returns a list of plate weights in loading order.
// Any unloadable remainder is reported as a final number with a negative value.
export const selectPlates = (
  loadingKg: number,
  barAndCollarsWeightKg: number,
  plates: ReadonlyArray<Plate>,
  inKg: boolean,
): Array<LoadedPlate> => {
  // Flow doesn't like it when arguments get redefined.
  let loadingAny = loadingKg;
  let barAndCollarsWeightAny = barAndCollarsWeightKg;
  let platesAny = plates;

  // Convert to pounds, avoiding floating point errors.
  if (inKg === false) {
    loadingAny = safeKg2Lbs(loadingKg);
    barAndCollarsWeightAny = safeKg2Lbs(barAndCollarsWeightKg);
    platesAny = plates.map((x) => ({ ...x, weightKg: safeKg2Lbs(x.weightKg) }));
  }

  // Sort a copy of the platesAny array by descending weight.
  const sortedPlates = platesAny.slice().sort((a, b) => {
    return b.weightKg - a.weightKg;
  });

  let sideWeightKg = (loadingAny - barAndCollarsWeightAny) / 2;
  const loading: Array<LoadedPlate> = [];

  // Run through each plate in order, applying as many of that plate as will fit.
  for (let i = 0; i < sortedPlates.length; i++) {
    const weightKg = sortedPlates[i].weightKg;
    const color = sortedPlates[i].color;
    let pairCount = sortedPlates[i].pairCount;
    while (pairCount > 0 && weightKg <= sideWeightKg) {
      pairCount--;
      sideWeightKg -= weightKg;
      loading.push({ weightAny: weightKg, isAlreadyLoaded: false, color: color });
    }
  }

  // Report any remainder as a negative number.
  if (sideWeightKg > 0) {
    loading.push({ weightAny: -sideWeightKg, isAlreadyLoaded: false, color: PlateColors.PLATE_DEFAULT_RED });
  }
  return loading;
};

// Helper function: like Array.findIndex(), but starting from a specific index.
const findWeightFrom = (loading: Array<LoadedPlate>, startFrom: number, weight: number): number => {
  for (let i = startFrom; i < loading.length; i++) {
    if (loading[i].weightAny === weight) return i;
  }
  return -1;
};

// Sets the 'isAlreadyLoaded' property of each LoadedPlate relative to another loading.
//
// Both 'loading' and 'relativeTo' are sorted in non-ascending order of weight.
export const makeLoadingRelative = (loading: Array<LoadedPlate>, relativeTo: Array<LoadedPlate>): void => {
  let finger = 0; // Increasing index into the relativeTo array.

  // For each plate in the loading, look for a matching plate in relativeTo[finger..].
  // When found, move the finger past that point.
  for (let i = 0; i < loading.length; i++) {
    const loadedPlate = loading[i];
    const index = findWeightFrom(relativeTo, finger, loadedPlate.weightAny);
    if (index >= 0) {
      finger = index + 1;
      loadedPlate.isAlreadyLoaded = true;
    }
  }
};
