// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Defines the logic for calculating the division Place of a lifter, shared between
// the Lifting page, the Rankings page, and data export code.
//
// The algorithm used is particularly bad -- the foremost goal was to make an interface
// that allowed for maximum code reuse between the Rankings and Lifting pages,
// which have slightly different needs.

import { getWeightClassStr } from "../reducers/meetReducer";
import { getFinalEventTotalKg } from "../reducers/registrationReducer";

import type { Sex, Event, Equipment, Entry } from "../reducers/registrationReducer";

export type Place = number | "DQ";

// Specifies a competition category under which entries can be ranked together.
export type Category = {
  sex: Sex,
  event: Event,
  equipment: Equipment,
  division: string,
  weightClassStr: string
};

// Wraps up all the entries in a category with the category's descriptors.
export type CategoryResults = {
  category: Category,
  orderedEntries: Array<Entry>
};

// Generates a unique String out of a Category, for purposes of using as a Map key.
const categoryToKey = (category: Category): string => {
  return JSON.stringify(category);
};
const keyToCategory = (key: string): Category => {
  return JSON.parse(key);
};

// Returns a copy of the entries array sorted by Place.
// All entries are assumed to be part of the same category.
const sortByPlaceInCategory = (entries: Array<Entry>, category: Category): Array<Entry> => {
  const event = category.event;

  // Clone the entries array to avoid modifying the original.
  let clonedEntries = entries.slice();

  // Sort in the given category, first place having the lowest index.
  clonedEntries.sort((a, b) => {
    // First sort by Total, higher sorting lower.
    const aTotal = getFinalEventTotalKg(a, event);
    const bTotal = getFinalEventTotalKg(b, event);
    if (aTotal !== bTotal) return bTotal - aTotal;

    // If totals are equal, sort by Bodyweight, lower sorting lower.
    if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

    // TODO: Breaking totals after this point is based on which lifter achieved
    // that total first... but that requires reusing the comparison code that
    // determines the lifting order. See Issue #65.
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
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
  return ["Raw", "Wraps", "Single-ply", "Multi-ply"].indexOf(eq);
};

// Determines the sort order by Sex.
const getSexSortOrder = (sex: Sex): number => {
  return sex === "M" ? 0 : 1;
};

// Determines the sort (and therefore presentation) order for the Category Results.
// The input array is sorted in-place; nothing is returned.
export const sortCategoryResults = (results: Array<CategoryResults>) => {
  results.sort((a, b) => {
    const catA = a.category;
    const catB = b.category;

    // First, sort by Event.
    const aEvent = getEventSortOrder(catA.event);
    const bEvent = getEventSortOrder(catB.event);
    if (aEvent !== bEvent) return aEvent - bEvent;

    // Next, sort by Equipment.
    const aEquipment = getEquipmentSortOrder(catA.equipment);
    const bEquipment = getEquipmentSortOrder(catB.equipment);
    if (aEquipment !== bEquipment) return aEquipment - bEquipment;

    // Next, sort by Sex.
    const aSex = getSexSortOrder(catA.sex);
    const bSex = getSexSortOrder(catB.sex);
    if (aSex !== bSex) return aSex - bSex;

    // Next, sort by WeightClass.
    // parseInt() ignores the "+" at the end of SHW class strings.
    const aWeightClass = parseInt(catA.weightClassStr);
    const bWeightClass = parseInt(catB.weightClassStr);
    if (aWeightClass !== bWeightClass) return aWeightClass - bWeightClass;

    // Finally, sort by Division as string.
    if (catA.division < catB.division) return -1;
    if (catA.division > catB.division) return 1;
    return 0; // Shouldn't happen!
  });
};

// Generates objects representing every present category of competition,
// with each entry given a Place designation.
//
// The returned objects are sorted in intended order of presentation.
export const getAllResults = (
  entries: Array<Entry>,
  weightClassesKgMen: Array<number>,
  weightClassesKgWomen: Array<number>
): Array<CategoryResults> => {
  // Generate a map from category to the entries within that category.
  // The map is populated by iterating over each entry and having the entry
  // append itself to per-category lists.
  let categoryMap = new Map();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];

    // Remember consistent properties.
    const sex = e.sex;
    const equipment = e.equipment;
    const classesForSex = sex === "M" ? weightClassesKgMen : weightClassesKgWomen;
    const weightClassStr = getWeightClassStr(classesForSex, e.bodyweightKg);

    // Iterate over every combination of division and event, adding to the map.
    for (let dividx = 0; dividx < e.divisions.length; dividx++) {
      const division = e.divisions[dividx];

      for (let evidx = 0; evidx < e.events.length; evidx++) {
        const event = e.events[evidx];
        const category = { sex, event, equipment, division, weightClassStr };
        const key = categoryToKey(category);

        const catEntries = categoryMap.get(key);
        catEntries === undefined ? categoryMap.set(key, [e]) : catEntries.push(e);
      }
    }
  }

  // Iterate over each category and assign a Place to the entries therein.
  let results = [];
  for (let [key, catEntries] of categoryMap) {
    const category = keyToCategory(key);
    const orderedEntries = sortByPlaceInCategory(catEntries, category);
    results.push({ category, orderedEntries });
  }

  sortCategoryResults(results);
  return results;
};
