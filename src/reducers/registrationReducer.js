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
    squatOpenerKg: 0.0,
    squatRackInfo: "", // A freeform string for the benefit of the loaders.
    benchOpenerKg: 0.0,
    benchRackInfo: "", // A freeform string for the benefit of the loaders.
    deadliftOpenerKg: 0.0
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

export default (state = initialState, action) => {
  switch (action.type) {
    case "NEW_DEFAULT_REGISTRATION": {
      // Generate an entries array with one more item (without modifying the orginal).
      let entries = state.entries.slice();
      entries.push(makeNewEntry(state.nextEntryId));

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
      let index = entries.findIndex(obj => obj.id === entryId);
      entries[index] = Object.assign(entries[index], changes);

      return {
        ...state,
        entries: entries
      };
    }

    case "OVERWRITE_STORE":
      return action.store.registration;

    default:
      return state;
  }
};
