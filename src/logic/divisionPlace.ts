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

// Defines the logic for calculating the division Place of a lifter, shared between
// the Lifting page, the Rankings page, and data export code.
//
// The algorithm used is particularly bad -- the foremost goal was to make an interface
// that allowed for maximum code reuse between the Rankings and Lifting pages,
// which have slightly different needs.

import { getProjectedEventTotalKg, getFinalEventTotalKg, liftToAttemptFieldName } from "./entry";
import { compareEntriesByAttempt } from "./liftingOrder";
import { getWeightClassStr } from "../reducers/meetReducer";

import { Sex, Event, Equipment, Entry, Lift } from "../types/dataTypes";
import { checkExhausted } from "../types/utils";
import { mapSexToClasses } from "./entry";

export type Place = number | "DQ";

// Determines how the total is calculated.
type ResultsType = "Projected" | "Final";

// Specifies a competition category under which entries can be ranked together.
export type Category = {
  sex: Sex;
  event: Event;
  equipment: Equipment;
  division: string;
  weightClassStr: string;
};

// Wraps up all the entries in a category with the category's descriptors.
export type CategoryResults = {
  category: Category;
  orderedEntries: Array<Entry>;
};

// Generates a unique String out of a Category, for purposes of using as a Map key.
const categoryToKey = (category: Category): string => {
  return JSON.stringify(category);
};
const keyToCategory = (key: string): Category => {
  return JSON.parse(key);
};

// Helper function for sortByPlaceInCategory().
//
// Determines the last successful Lift (for example, "B") for the Entry in
// the given Event category.
//
// Lifters have already been checked to have a non-zero total.
const getLastSuccessfulLift = (event: Event, entry: Entry): Lift => {
  // Iterate backwards over the Event types.
  for (let i = event.length - 1; i >= 0; --i) {
    const lift = event[i];
    switch (lift) {
      case "S":
        if (entry.squatStatus.includes(1)) {
          return "S";
        }
        break;
      case "B":
        if (entry.benchStatus.includes(1)) {
          return "B";
        }
        break;
      case "D":
        if (entry.deadliftStatus.includes(1)) {
          return "D";
        }
        break;
      default:
        return "S";
    }
  }
  return "S";
};

// Helper function for sortByPlaceInCategory().
//
// Determines the last successful attempt (only counting the first three) for
// the Entry for the given Lift.
//
// The caller already knows that a successful attempt was made, since it
// passed getLastSuccessfulLift().
const getLastSuccessfulAttempt = (lift: Lift, entry: Entry): number => {
  let statuses = null;
  switch (lift) {
    case "S":
      statuses = entry.squatStatus;
      break;
    case "B":
      statuses = entry.benchStatus;
      break;
    case "D":
      statuses = entry.deadliftStatus;
      break;
    default:
      checkExhausted(lift);
      return 0;
  }

  // Consider only the first three attempts, in reverse.
  for (let i = 2; i >= 0; --i) {
    if (statuses[i] === 1) return i;
  }
  return 0;
};

// Returns a copy of the entries array sorted by Place.
// All entries are assumed to be part of the same category.
const sortByPlaceInCategory = (entries: ReadonlyArray<Entry>, category: Category, type: ResultsType): Array<Entry> => {
  const event = category.event;

  // Clone the entries array to avoid modifying the original.
  const clonedEntries = entries.slice();

  // Sort in the given category, first place having the lowest index.
  clonedEntries.sort((a, b) => {
    // If either of the lifters are guests, sort the guest last
    if (a.guest !== b.guest) {
      return Number(a.guest) - Number(b.guest);
    }
    // Otherwise, both lifters are non-guests or guests, so sort as per usual
    let aTotal = 0;

    // First sort by Total, higher sorting lower.
    if (type === "Projected") {
      aTotal = getProjectedEventTotalKg(a, event);
      const bTotal = getProjectedEventTotalKg(b, event);
      if (aTotal !== bTotal) return bTotal - aTotal;
    } else if (type === "Final") {
      aTotal = getFinalEventTotalKg(a, event);
      const bTotal = getFinalEventTotalKg(b, event);
      if (aTotal !== bTotal) return bTotal - aTotal;
    }

    // If totals are equal, sort by Bodyweight, lower sorting lower.
    if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

    // If totals are zero, neither lifter took a successful attempt,
    // so just sort arbitrarily by name.
    if (aTotal === 0) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }

    // If totals are equal and bodyweights are equal, the winner is the
    // lifter who reached the total first. Because our implementation is
    // stateless and doesn't remember lifting order, this gets complicated.
    //
    // For purposes of simplicity, this is broken into cases.
    //
    // At this point, the logic requires that each lifter have taken at least
    // one successful attempt -- this is validated by checking the total
    // against zero above.
    //
    // Case 1: If the lifters' last successful lifts were for different Lifts,
    //         then the lifter with the earlier lift in SBD order wins.
    const aLastSuccessfulLift = getLastSuccessfulLift(event, a);
    const bLastSuccessfulLift = getLastSuccessfulLift(event, b);
    const aLastSuccessfulLiftIndex = ["S", "B", "D"].indexOf(aLastSuccessfulLift);
    const bLastSuccessfulLiftIndex = ["S", "B", "D"].indexOf(bLastSuccessfulLift);
    if (aLastSuccessfulLiftIndex !== bLastSuccessfulLiftIndex) {
      return aLastSuccessfulLiftIndex - bLastSuccessfulLiftIndex;
    }

    // Case 2: If the lifters reached the total on the same lift but on different
    //         attempts, the lifter with the earlier attempt wins.
    const lift: Lift = aLastSuccessfulLift;
    const aLastSuccessfulAttempt: number = getLastSuccessfulAttempt(lift, a);
    const bLastSuccessfulAttempt: number = getLastSuccessfulAttempt(lift, b);
    if (aLastSuccessfulAttempt !== bLastSuccessfulAttempt) {
      return aLastSuccessfulAttempt - bLastSuccessfulAttempt;
    }

    // Case 3: If the lifters reached the total on the same lift and on the same
    //         attempt, defer to the lifting order to determine who lifted first.
    const attempt = aLastSuccessfulAttempt;
    return compareEntriesByAttempt(a, b, liftToAttemptFieldName(lift), attempt);
  });

  return clonedEntries;
};

// Determines the sort order by Event.
const getEventSortOrder = (ev: Event): number => {
  return ["SBD", "BD", "SB", "SD", "S", "B", "D"].indexOf(ev);
};

// Determines the sort order by Equipment.
const getEquipmentSortOrder = (eq: Equipment): number => {
  return ["Bare", "Sleeves", "Wraps", "Single-ply", "Multi-ply", "Unlimited"].indexOf(eq);
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
      checkExhausted(sex);
      return 3;
  }
};

// Determines the sort (and therefore presentation) order for the Category Results.
// The input array is sorted in-place; nothing is returned.
export const sortCategoryResults = (results: Array<CategoryResults>): void => {
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

    // Next, sort by Equipment.
    const aEquipment = getEquipmentSortOrder(catA.equipment);
    const bEquipment = getEquipmentSortOrder(catB.equipment);
    if (aEquipment !== bEquipment) return aEquipment - bEquipment;

    // Next, sort by Division as string.
    if (catA.division < catB.division) return -1;
    if (catA.division > catB.division) return 1;

    // Finally, sort by WeightClass.
    // Any SHW class should be placed at the end.
    const aIsSHW: boolean = catA.weightClassStr.includes("+");
    const bIsSHW: boolean = catB.weightClassStr.includes("+");
    if (aIsSHW && !bIsSHW) return 1;
    if (!aIsSHW && bIsSHW) return -1;
    // parseInt() ignores the "+" at the end of SHW class strings.
    const aWeightClass = catA.weightClassStr === "" ? 0 : parseInt(catA.weightClassStr);
    const bWeightClass = catB.weightClassStr === "" ? 0 : parseInt(catB.weightClassStr);
    return aWeightClass - bWeightClass;
  });
};

// Generates objects representing every present category of competition,
// with each entry given a Place designation.
//
// The returned objects are sorted in intended order of presentation.
const getAllResults = (
  entries: ReadonlyArray<Entry>,
  weightClassesKgMen: ReadonlyArray<number>,
  weightClassesKgWomen: ReadonlyArray<number>,
  weightClassesKgMx: ReadonlyArray<number>,
  combineSleevesAndWraps: boolean,
  type: ResultsType
): Array<CategoryResults> => {
  // Generate a map from category to the entries within that category.
  // The map is populated by iterating over each entry and having the entry
  // append itself to per-category lists.
  const categoryMap = new Map<string, Entry[]>();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];

    // Remember consistent properties.
    const sex = e.sex;
    const classesForSex = mapSexToClasses(sex, weightClassesKgMen, weightClassesKgWomen, weightClassesKgMx);
    const weightClassStr = getWeightClassStr(classesForSex, e.bodyweightKg);

    // If the results combine Sleeves and Wraps, promote Sleeves to Wraps.
    let equipment = e.equipment;
    if (combineSleevesAndWraps && equipment === "Sleeves") {
      equipment = "Wraps";
    }

    // Iterate over every combination of division and event, adding to the map.
    //
    // This code also intentionally executes if `e.divisions.length === 0`.
    // This is used to handle an exceptional case where a meet director expects
    // all lifters to compete Open, but has failed to specify any division
    // on the registration page, believing that to be unneeded.
    //
    // If that special case were not handled, the lifter would disappear from results.
    const numDivisions = e.divisions.length;
    let dividx: number = 0;
    do {
      const division = numDivisions > 0 ? e.divisions[dividx] : "";

      for (let evidx = 0; evidx < e.events.length; evidx++) {
        const event = e.events[evidx];
        const category = { sex, event, equipment, division, weightClassStr };
        const key = categoryToKey(category);

        const catEntries = categoryMap.get(key);
        catEntries === undefined ? categoryMap.set(key, [e]) : catEntries.push(e);
      }
    } while (++dividx < numDivisions);
  }

  // Iterate over each category and assign a Place to the entries therein.
  const results = [];
  for (const [key, catEntries] of categoryMap) {
    const category = keyToCategory(key);
    const orderedEntries = sortByPlaceInCategory(catEntries, category, type);
    results.push({ category, orderedEntries });
  }

  sortCategoryResults(results);
  return results;
};

export const getProjectedResults = (
  entries: ReadonlyArray<Entry>,
  weightClassesKgMen: ReadonlyArray<number>,
  weightClassesKgWomen: ReadonlyArray<number>,
  weightClassesKgMx: ReadonlyArray<number>,
  combineSleevesAndWraps: boolean
): Array<CategoryResults> => {
  return getAllResults(
    entries,
    weightClassesKgMen,
    weightClassesKgWomen,
    weightClassesKgMx,
    combineSleevesAndWraps,
    "Projected"
  );
};

export const getFinalResults = (
  entries: ReadonlyArray<Entry>,
  weightClassesKgMen: ReadonlyArray<number>,
  weightClassesKgWomen: ReadonlyArray<number>,
  weightClassesKgMx: ReadonlyArray<number>,
  combineSleevesAndWraps: boolean
): Array<CategoryResults> => {
  return getAllResults(
    entries,
    weightClassesKgMen,
    weightClassesKgWomen,
    weightClassesKgMx,
    combineSleevesAndWraps,
    "Final"
  );
};
