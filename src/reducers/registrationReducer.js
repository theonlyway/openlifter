// vim: set ts=2 sts=2 sw=2 et:
// @flow

import { wilksMen, wilksWomen } from "../common/wilks.js";

// Length of {squat,bench,deadlift}{Kg,status} in each entry.
export const MAX_ATTEMPTS = 5;

export type Sex = "M" | "F";
export type Lift = "S" | "B" | "D";
export type FieldKg = "squatKg" | "benchKg" | "deadliftKg";
export type FieldStatus = "squatStatus" | "benchStatus" | "deadliftStatus";
export type Equipment = "Raw" | "Wraps" | "Single-ply" | "Multi-ply";
export type Event = "S" | "B" | "D" | "SB" | "SD" | "BD" | "SBD";

export type LiftStatus =
  | -1 // Failure.
  | 0 // Not yet taken.
  | 1; // Success.

export type Entry = {
  id: number,
  day: number,
  platform: number,
  flight: string,
  name: string,
  sex: Sex,
  birthDate: string,
  age: number,
  intendedWeightClassKg: string,
  equipment: Equipment,
  divisions: Array<string>,
  events: Array<Event>,
  lot: number,
  paid: boolean,
  bodyweightKg: number,
  squatRackInfo: string,
  benchRackInfo: string,
  squatKg: Array<number>,
  benchKg: Array<number>,
  deadliftKg: Array<number>,
  squatStatus: Array<LiftStatus>,
  benchStatus: Array<LiftStatus>,
  deadliftStatus: Array<LiftStatus>
};

export const getDateString = (dateTime: Date) => {
  if (dateTime) {
    return [dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()].join("/");
  }
};

const makeNewEntry = (id: number): Entry => {
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

export type Registration = {
  nextEntryId: number,
  entries: Array<Entry>,
  lookup: {
    [id: number]: number
  }
};

const initialState: Registration = {
  // The next unique ID to assign.
  //
  // This is stored in global state to handle the case of deleting registration
  // rows during the course of lifting.
  //
  // A large number is used as the initial value to make it clear that this is
  // specifically not an index into the `entries` array.
  nextEntryId: 5000,

  // Entry objects in the order they appear on the Registration page.
  // This array owns all registration information.
  entries: [],

  // Hash from unique ID to `entries` array index.
  //
  // This is for the benefit of pages other than the Registration page.
  // Because the sort order of the `entries` array can change arbitrarily,
  // the other pages remember globally-unique identifiers for each registration,
  // instead of a simple array index.
  //
  // This lookup table allows mapping those identifiers to whatever
  // the current location of that data is in the canonical `entries` store.
  lookup: {}
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

// Gets the Wilks score using the projected total.
export const getProjectedWilks = (entry: Entry): number => {
  const totalKg = getProjectedTotalKg(entry);
  if (totalKg === 0) {
    return 0;
  }
  if (entry.sex === "F") {
    return wilksWomen(entry.bodyweightKg) * totalKg;
  } else {
    return wilksMen(entry.bodyweightKg) * totalKg;
  }
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

export default (state: Registration = initialState, action: Object): Registration => {
  switch (action.type) {
    case "NEW_REGISTRATION": {
      // The object provides optional properties that can overwrite the default.
      // Although the UI doesn't pass properties this way, debugging code does.
      const obj = action.overwriteDefaults;

      // Generate an entries array with one more item (without modifying the orginal).
      // Object.assign() allows `obj` to overwrite defaults if present.
      let entries: Array<Entry> = state.entries.slice();
      let newEntry = makeNewEntry(state.nextEntryId);

      // If a previous entry exists, pre-populate some information from it.
      if (entries.length > 0) {
        const previousEntry = entries[entries.length - 1];
        newEntry.day = previousEntry.day;
        newEntry.platform = previousEntry.platform;
        newEntry.flight = previousEntry.flight;
      }

      // Overwrite any newEntry properties with those given in obj.
      entries.push(Object.assign(newEntry, obj));

      // Since a new entry was added, generate a new 'lookup' object,
      // mapping from the globally-unique EntryId to the array index.
      let lookup = Object.assign({}, state.lookup);
      lookup[state.nextEntryId] = entries.length - 1;

      return {
        ...state,
        nextEntryId: state.nextEntryId + 1,
        entries: entries,
        lookup: lookup
      };
    }

    case "DELETE_REGISTRATION": {
      const entryId = action.entryId;

      // Generate an entries array without the given item.
      let entries: Array<Entry> = state.entries.filter((item, index) => item.id !== entryId);

      // Since the entry was deleted from anywhere in the array,
      // construct a new lookup table from scratch.
      let lookup = {};
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        lookup[entry.id] = i;
      }

      return {
        ...state,
        entries: entries,
        lookup: lookup
      };
    }

    case "UPDATE_REGISTRATION": {
      const entryId = action.entryId;
      const changes = action.changes;

      // Clone the entries array, since one entry will reference a new object.
      let entries: Array<Entry> = state.entries.slice();

      // Make a new object with just the changes overwritten,
      // and reference that object from the new array.
      const index = entries.findIndex(obj => obj.id === entryId);
      entries[index] = Object.assign(entries[index], changes);

      return {
        ...state,
        entries: entries
      };
    }

    case "ENTER_ATTEMPT": {
      // Action parameters, with expected types.
      const entryId = Number(action.entryId);
      const lift: Lift = action.lift;
      const attemptOneIndexed = Number(action.attemptOneIndexed);
      const weightKg = Number(action.weightKg);

      const field: FieldKg = liftToAttemptFieldName(lift);

      // Clone the entries array, since one slot will reference a new object.
      let newEntries: Array<Entry> = state.entries.slice();
      const index = newEntries.findIndex(obj => obj.id === entryId);
      const oldEntry = newEntries[index];

      // Make a copy of the attempts array containing the new attempt.
      let newarray = oldEntry[field].slice();
      newarray[attemptOneIndexed - 1] = weightKg;

      // Put that new attempts array into an object so we can use Object.assign().
      let newfields = {};
      newfields[field] = newarray;

      // Make a new entry from the old entry, with the attempts field overwritten.
      newEntries[index] = Object.assign(oldEntry, newfields);

      return {
        ...state,
        entries: newEntries
      };
    }

    case "MARK_LIFT": {
      const entryId = Number(action.entryId);
      const lift: Lift = action.lift;
      const attemptOneIndexed = Number(action.attemptOneIndexed);
      const success = Boolean(action.success);

      // Map true to '1' and false to '-1'.
      const status = success === true ? 1 : -1;

      const fieldStatus = liftToStatusFieldName(lift);

      // Clone the entries array, since one slot will reference a new object.
      let newEntries: Array<Entry> = state.entries.slice();
      const index = newEntries.findIndex(obj => obj.id === entryId);
      const oldEntry = newEntries[index];

      // Make a copy of the status array containing the new status.
      let newarray = oldEntry[fieldStatus].slice();
      newarray[attemptOneIndexed - 1] = status;

      // Put that new array into an object so we can use Object.assign().
      let newfields = {};
      newfields[fieldStatus] = newarray;

      // Make a new entry from the old entry, with the status field overwritten.
      newEntries[index] = Object.assign(oldEntry, newfields);

      return {
        ...state,
        entries: newEntries
      };
    }

    case "OVERWRITE_STORE": {
      // Copy all the state objects into an empty object.
      const obj = Object.assign({}, state);

      // Copy in the action's objects, overwriting the state's objects.
      return Object.assign(obj, action.store.registration);
    }

    default:
      return state;
  }
};
