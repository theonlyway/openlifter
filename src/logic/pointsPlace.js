// vim: set ts=2 sts=2 sw=2 et:
// @flow strict
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

// Defines the logic for calculating the division Place of a lifter, shared between
// the Lifting page, the Rankings page, and data export code.
//
// The algorithm used is particularly bad -- the foremost goal was to make an interface
// that allowed for maximum code reuse between the Rankings and Lifting pages,
// which have slightly different needs.

import { getFinalEventTotalKg } from "./entry";

// Import points formulas.
import { bodyweight_multiple } from "./coefficients/bodyweight-multiple";
import { dots } from "./coefficients/dots";
import { glossbrenner } from "./coefficients/glossbrenner";
import { ipfpoints } from "./coefficients/ipf";
import { nasapoints } from "./coefficients/nasa";
import { schwartzmalone } from "./coefficients/schwartzmalone";
import { wilks } from "./coefficients/wilks";

// Import age coefficients.
import { fosterMcCulloch } from "./coefficients/foster-mcculloch";

import type { AgeCoefficients, Sex, Event, Equipment, Entry, Formula } from "../types/dataTypes";

// Specifies a points category under which entries can be ranked together.
export type PointsCategory = {
  sex: Sex,
  event: Event,
  equipment: Equipment
};

// Wraps up all the entries in a category with the category's descriptors.
export type PointsCategoryResults = {
  category: PointsCategory,
  orderedEntries: Array<Entry>
};

// Generates a unique String out of a Category, for purposes of using as a Map key.
const categoryToKey = (category: PointsCategory): string => {
  return JSON.stringify(category);
};
const keyToCategory = (key: string): PointsCategory => {
  return JSON.parse(key);
};

// Returns a copy of the entries array sorted by Formula Place (Rank).
// All entries are assumed to be part of the same category.
const sortByFormulaPlaceInCategory = (
  entries: Array<Entry>,
  category: PointsCategory,
  formula: Formula,
  ageCoefficients: AgeCoefficients
): Array<Entry> => {
  // Make a map from Entry to initial index.
  let indexMap = new Map();
  for (let i = 0; i < entries.length; i++) {
    indexMap.set(entries[i], i);
  }

  // Pre-calculate all the points into an array to avoid computing them multiple
  // times in the sort.
  let memoizedPoints = new Array(entries.length);
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const totalKg = getFinalEventTotalKg(entry, category.event);

    switch (formula) {
      case "Bodyweight Multiple":
        memoizedPoints[i] = bodyweight_multiple(entry.bodyweightKg, totalKg);
        break;
      case "Glossbrenner":
        memoizedPoints[i] = glossbrenner(category.sex, entry.bodyweightKg, totalKg);
        break;
      case "Wilks":
        memoizedPoints[i] = wilks(category.sex, entry.bodyweightKg, totalKg);
        break;
      case "IPF Points":
        memoizedPoints[i] = ipfpoints(totalKg, entry.bodyweightKg, category.sex, category.equipment, category.event);
        break;
      case "Schwartz/Malone":
        memoizedPoints[i] = schwartzmalone(category.sex, entry.bodyweightKg, totalKg);
        break;
      case "NASA Points":
        memoizedPoints[i] = nasapoints(entry.bodyweightKg, totalKg);
        break;
      case "Dots":
        memoizedPoints[i] = dots(category.sex, entry.bodyweightKg, totalKg);
        break;
      default:
        (formula: empty) // eslint-disable-line
        memoizedPoints[i] = 0;
    }

    // Apply age coefficients now, if requested.
    switch (ageCoefficients) {
      case "None":
        break;
      case "FosterMcCulloch":
        memoizedPoints[i] = memoizedPoints[i] * fosterMcCulloch(entry.age);
        break;
      default:
        (ageCoefficients: empty) // eslint-disable-line
        break;
    }
  }

  // Clone the entries array to avoid modifying the original.
  let clonedEntries = entries.slice();

  // Sort in the given category, first place having the lowest index.
  clonedEntries.sort((a, b) => {
    const aIndex = indexMap.get(a);
    const bIndex = indexMap.get(b);

    // Appease the type checker even though this can't happen.
    if (aIndex === undefined || bIndex === undefined) return 0;

    // First sort by points, higher sorting lower.
    const aPoints = memoizedPoints[aIndex];
    const bPoints = memoizedPoints[bIndex];
    if (aPoints !== bPoints) return bPoints - aPoints;

    // If points are equal, sort by Bodyweight, lower sorting lower.
    if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

    // Otherwise, they're equal.
    return 0;
  });

  return clonedEntries;
};

// Determines the sort order by Event.
const getEventSortOrder = (ev: Event): number => {
  return ["SBD", "BD", "SB", "SD", "S", "B", "D"].indexOf(ev);
};

// Determines the sort order by Equipment.
const getEquipmentSortOrder = (eq: Equipment): number => {
  // Combine classic and equipped lifting.
  return ["Bare", "Sleeves", "Wraps", "Single-ply", "Multi-ply"].indexOf(eq);
};

// Determines the sort order by Sex.
const getSexSortOrder = (sex: Sex): number => {
  switch (sex) {
    case "F":
      return 0;
    case "M":
      return 1;
    case "Mx":
      return 2;
    default:
      (sex: empty) // eslint-disable-line
      return 3;
  }
};

// Determines the sort (and therefore presentation) order for the Category Results.
// The input array is sorted in-place; nothing is returned.
export const sortPointsCategoryResults = (results: Array<PointsCategoryResults>) => {
  results.sort((a, b) => {
    const catA = a.category;
    const catB = b.category;

    // First, sort by Sex.
    const aSex = getSexSortOrder(catA.sex);
    const bSex = getSexSortOrder(catB.sex);
    if (aSex !== bSex) return aSex - bSex;

    // Next, sort by Event.
    const aEvent = getEventSortOrder(catA.event);
    const bEvent = getEventSortOrder(catB.event);
    if (aEvent !== bEvent) return aEvent - bEvent;

    // Finally, sort by Equipment.
    const aEquipment = getEquipmentSortOrder(catA.equipment);
    const bEquipment = getEquipmentSortOrder(catB.equipment);
    if (aEquipment !== bEquipment) return aEquipment - bEquipment;

    return 0;
  });
};

// Generates objects representing the various ByPoints categories.
// The returned objects are sorted in intended order of presentation.
export const getAllRankings = (
  entries: Array<Entry>,
  formula: Formula,
  ageCoefficients: AgeCoefficients,
  combineSleevesAndWraps: boolean
): Array<PointsCategoryResults> => {
  // Generate a map from category to the entries within that category.
  // The map is populated by iterating over each entry and having the entry
  // append itself to per-category lists.
  let categoryMap = new Map();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];

    // Remember consistent properties.
    const sex = e.sex;
    let equipment: Equipment = e.equipment;

    // If the results combine Sleeves and Wraps, promote Sleeves to Wraps.
    if (combineSleevesAndWraps && equipment === "Sleeves") {
      equipment = "Wraps";
    }

    // Iterate over each event, adding to the map.
    for (let evidx = 0; evidx < e.events.length; evidx++) {
      const event = e.events[evidx];
      const category = { sex, event, equipment };
      const key = categoryToKey(category);

      const catEntries = categoryMap.get(key);
      catEntries === undefined ? categoryMap.set(key, [e]) : catEntries.push(e);
    }
  }

  // Iterate over each category and assign a Place to the entries therein.
  let results = [];
  for (let [key, catEntries] of categoryMap) {
    const category = keyToCategory(key);
    const orderedEntries = sortByFormulaPlaceInCategory(catEntries, category, formula, ageCoefficients);
    results.push({ category, orderedEntries });
  }

  sortPointsCategoryResults(results);
  return results;
};
