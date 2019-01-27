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

// Defines logic for creating and working with Entry objects.

import { glossbrenner } from "../logic/coefficients/glossbrenner";
import { ipfpoints } from "../logic/coefficients/ipf";
import { wilks } from "../logic/coefficients/wilks";

import type { Entry, Lift, Event, FieldKg, FieldStatus } from "../types/dataTypes";

// Length of {squat,bench,deadlift}{Kg,Status} in each Entry.
export const MAX_ATTEMPTS = 5;

export const newDefaultEntry = (id: number): Entry => {
  return {
    // Bookkeeping internal information for OpenLifter.
    id: id, // The global unique ID of this registration.

    // Information about when the lifter is scheduled to lift.
    day: 1, // The day on which the lifter is lifting.
    platform: 1, // The platform on which the lifter is lifting.
    flight: "A", // The flight in which the lifter is lifting.

    // Information about the lifter themselves.
    name: "", // The lifter's name.
    sex: "M", // The lifter's sex.
    birthDate: "", // The lifter's birthdate (YYYY-MM-DD).
    age: 0, // The lifter's age in years
    intendedWeightClassKg: "", // The weightclass for which the lifter registered.
    equipment: "Raw", // The equipment category for which the lifter registered.
    divisions: [], // A list of divisions the lifter entered.
    events: [], // A list of events the lifter entered.

    // Metadata about the lifter, assigned by the meet director.
    lot: 0, // The lifter's lot number, for breaking ties in lifting order.
    paid: false, // Used by the meet director for tracking whether the lifter paid.

    // Information added on the "Weigh-ins" page.
    // But we might as well track it in this object.
    bodyweightKg: 0.0,
    squatRackInfo: "", // A freeform string for the benefit of the loaders.
    benchRackInfo: "", // A freeform string for the benefit of the loaders.

    // Lifting information. Weights always stored internally in kg.
    squatKg: [0.0, 0.0, 0.0, 0.0, 0.0],
    benchKg: [0.0, 0.0, 0.0, 0.0, 0.0],
    deadliftKg: [0.0, 0.0, 0.0, 0.0, 0.0],

    // Lifting information, success state:
    //  -1 => No Lift.
    //   0 => Not Yet Done.
    //   1 => Good Lift.
    //
    // Note that this system has the property where corresponding (kg*status)
    // produces the SquatXKg as expected by the main OpenPowerlifting CSV format.
    squatStatus: [0, 0, 0, 0, 0],
    benchStatus: [0, 0, 0, 0, 0],
    deadliftStatus: [0, 0, 0, 0, 0]
  };
};

// Gets the best squat, including extra attempts that don't count for the total.
export const getBest5SquatKg = (entry: Entry): number => {
  let best3SquatKg = 0.0;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (entry.squatStatus[i] === 1) {
      best3SquatKg = Math.max(best3SquatKg, entry.squatKg[i]);
    }
  }
  return best3SquatKg;
};

// Gets the best bench, including extra attempts that don't count for the total.
export const getBest5BenchKg = (entry: Entry): number => {
  let best3BenchKg = 0.0;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (entry.benchStatus[i] === 1) {
      best3BenchKg = Math.max(best3BenchKg, entry.benchKg[i]);
    }
  }
  return best3BenchKg;
};

// Gets the best deadlift, including extra attempts that don't count for the total.
export const getBest5DeadliftKg = (entry: Entry): number => {
  let best3DeadliftKg = 0.0;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (entry.deadliftStatus[i] === 1) {
      best3DeadliftKg = Math.max(best3DeadliftKg, entry.deadliftKg[i]);
    }
  }
  return best3DeadliftKg;
};

// The ProjectedTotal optimistically assumes that lifters will get *first* attempts
// that have not yet been taken. It is used for calculating a total while lifters
// are still squatting and benching.
//
// 2nd and 3rd attempts are treated normally, where they only count toward the
// total if they have been successful.
export const getProjectedTotalKg = (entry: Entry): number => {
  let best3Squat = 0.0;
  if (entry.squatStatus[0] >= 0) best3Squat = Math.max(best3Squat, entry.squatKg[0]);
  if (entry.squatStatus[1] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[1]);
  if (entry.squatStatus[2] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[2]);

  let best3Bench = 0.0;
  if (entry.benchStatus[0] >= 0) best3Bench = Math.max(best3Bench, entry.benchKg[0]);
  if (entry.benchStatus[1] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[1]);
  if (entry.benchStatus[2] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[2]);

  let best3Dead = 0.0;
  if (entry.deadliftStatus[0] >= 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[0]);
  if (entry.deadliftStatus[1] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[1]);
  if (entry.deadliftStatus[2] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[2]);

  // If there was no attempted success for a single lift, return zero.
  if (best3Squat === 0 && entry.squatStatus[0] === -1) return 0.0;
  if (best3Bench === 0 && entry.benchStatus[0] === -1) return 0.0;
  if (best3Dead === 0 && entry.deadliftStatus[0] === -1) return 0.0;

  return best3Squat + best3Bench + best3Dead;
};

// The Total is the sum of best of the first 3 attempts of each lift.
export const getFinalTotalKg = (entry: Entry): number => {
  let best3Squat = 0.0;
  if (entry.squatStatus[0] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[0]);
  if (entry.squatStatus[1] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[1]);
  if (entry.squatStatus[2] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[2]);

  let best3Bench = 0.0;
  if (entry.benchStatus[0] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[0]);
  if (entry.benchStatus[1] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[1]);
  if (entry.benchStatus[2] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[2]);

  let best3Dead = 0.0;
  if (entry.deadliftStatus[0] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[0]);
  if (entry.deadliftStatus[1] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[1]);
  if (entry.deadliftStatus[2] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[2]);

  // If there was no attempted success for a single lift, return zero.
  if (best3Squat === 0 && entry.squatStatus[0] === -1) return 0.0;
  if (best3Bench === 0 && entry.benchStatus[0] === -1) return 0.0;
  if (best3Dead === 0 && entry.deadliftStatus[0] === -1) return 0.0;

  return best3Squat + best3Bench + best3Dead;
};

// Restricts the total calculation to just for the specified Event.
export const getFinalEventTotalKg = (entry: Entry, event: Event): number => {
  let best3Squat = 0.0;
  if (event.includes("S")) {
    if (entry.squatStatus[0] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[0]);
    if (entry.squatStatus[1] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[1]);
    if (entry.squatStatus[2] > 0) best3Squat = Math.max(best3Squat, entry.squatKg[2]);
    if (best3Squat === 0) return 0.0;
  }

  let best3Bench = 0.0;
  if (event.includes("B")) {
    if (entry.benchStatus[0] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[0]);
    if (entry.benchStatus[1] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[1]);
    if (entry.benchStatus[2] > 0) best3Bench = Math.max(best3Bench, entry.benchKg[2]);
    if (best3Bench === 0) return 0.0;
  }

  let best3Dead = 0.0;
  if (event.includes("D")) {
    if (entry.deadliftStatus[0] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[0]);
    if (entry.deadliftStatus[1] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[1]);
    if (entry.deadliftStatus[2] > 0) best3Dead = Math.max(best3Dead, entry.deadliftKg[2]);
    if (best3Dead === 0) return 0.0;
  }

  return best3Squat + best3Bench + best3Dead;
};

// Gets the Wilks score using the projected total.
export const getProjectedWilks = (entry: Entry): number => {
  return wilks(entry.sex, entry.bodyweightKg, getProjectedTotalKg(entry));
};

// Gets the Wilks score using the final total.
export const getFinalWilks = (entry: Entry): number => {
  return wilks(entry.sex, entry.bodyweightKg, getFinalTotalKg(entry));
};

export const getProjectedIPFPoints = (entry: Entry, event: Event): number => {
  const totalKg = getProjectedTotalKg(entry);
  return ipfpoints(totalKg, entry.bodyweightKg, entry.sex, entry.equipment, event);
};
export const getFinalIPFPoints = (entry: Entry, event: Event): number => {
  const totalKg = getFinalTotalKg(entry);
  return ipfpoints(totalKg, entry.bodyweightKg, entry.sex, entry.equipment, event);
};

export const getProjectedGlossbrenner = (entry: Entry): number => {
  const totalKg = getProjectedTotalKg(entry);
  return glossbrenner(entry.sex, entry.bodyweightKg, totalKg);
};
export const getFinalGlossbrenner = (entry: Entry): number => {
  const totalKg = getFinalTotalKg(entry);
  return glossbrenner(entry.sex, entry.bodyweightKg, totalKg);
};

// Filter entries to only get lifters that are lifting on a given day
export const getLiftersOnDay = (entries: Array<Entry>, day: number): Array<Entry> => {
  if (!entries) {
    return [];
  }
  return entries.filter(entry => {
    return entry.day === day;
  });
};

// Convert a lift like "S" to the kg array field name, like "squatKg".
export const liftToAttemptFieldName = (lift: Lift): FieldKg => {
  switch (lift) {
    case "S":
      return "squatKg";
    case "B":
      return "benchKg";
    case "D":
      return "deadliftKg";
    default:
      (lift: empty); // eslint-disable-line
      return "squatKg";
  }
};

// Convert a lift like "S" to the status array field name, like "squatStatus".
export const liftToStatusFieldName = (lift: Lift): FieldStatus => {
  switch (lift) {
    case "S":
      return "squatStatus";
    case "B":
      return "benchStatus";
    case "D":
      return "deadliftStatus";
    default:
      (lift: empty); // eslint-disable-line
      return "squatStatus";
  }
};

// Helper function: performs an in-place sort on an array of entries.
// Assumes that zero entries are not mixed in with non-zero entries.
export const orderEntriesByAttempt = (
  entries: Array<Entry>,
  fieldKg: FieldKg,
  attemptOneIndexed: number
): Array<Entry> => {
  return entries.sort((a, b) => {
    const aKg = a[fieldKg][attemptOneIndexed - 1];
    const bKg = b[fieldKg][attemptOneIndexed - 1];

    // If non-equal, sort by weight, ascending.
    if (aKg !== bKg) return aKg - bKg;

    // If the federation uses lot numbers, break ties using lot.
    if (a.lot !== 0 && b.lot !== 0) return a.lot - b.lot;

    // Try to break ties using bodyweight, with the lighter lifter going first.
    if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

    // If we've run out of properties by which to compare them, resort to Name.
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
};