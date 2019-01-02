// vim: set ts=2 sts=2 sw=2 et:

const initialState = {
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

const makeNewEntry = id => {
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
    birthdate: "", // The lifter's birthdate (YYYY-MM-DD).
    intendedWeightClassKg: "", // The weightclass for which the lifter registered.
    equipment: "Sleeves", // The equipment category for which the lifter registered.
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

// Filter entries to only get lifters that are lifting on a given day
export const getLiftersOnDay = (entries, day) => {
  if (!entries) {
    return [];
  }
  return entries.filter(entry => {
    return entry.day === day;
  });
};

// Convert a lift like "S" to the array field name, like "squatKg".
export const liftToAttemptFieldName = lift => {
  switch (lift) {
    case "S":
      return "squatKg";
    case "B":
      return "benchKg";
    case "D":
      return "deadliftKg";
    default:
      break; // Linter complains about unreachable code if this returns.
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "NEW_REGISTRATION": {
      // The object provides optional properties that can overwrite the default.
      // Although the UI doesn't pass properties this way, debugging code does.
      const obj = action.overwriteDefaults;

      // Generate an entries array with one more item (without modifying the orginal).
      // Object.assign() allows `obj` to overwrite defaults if present.
      let entries = state.entries.slice();
      entries.push(Object.assign(makeNewEntry(state.nextEntryId), obj));

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
      let entries = state.entries.filter((item, index) => item.id !== entryId);

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
      let entries = state.entries.slice();

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
      const lift = String(action.lift);
      const attemptOneIndexed = Number(action.attemptOneIndexed);
      const weightKg = Number(action.weightKg);

      const field = liftToAttemptFieldName(lift);

      // Clone the entries array, since one object will reference a new object.
      let newEntries = state.entries.slice();
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
