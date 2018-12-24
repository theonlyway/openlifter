// vim: set ts=2 sts=2 sw=2 et:

const initialState = {
  // Hashmap from global ID to weigh-ins Entry object.
  //
  // Because the Weigh-ins page always displays sorted data,
  // and only the Registration page controls the presence of rows,
  // a simple object can be used here.
  entriesHash: {}
};

const makeNewEntry = id => {
  return {
    id: id, // EntryId, stored again for use during iteration.
    bodyweightKg: 0.0,
    squatFirstAttemptKg: 0.0,
    squatRackInfo: "", // A freeform string for the benefit of the loaders.
    benchFirstAttemptKg: 0.0,
    benchRackInfo: "", // A freeform string for the benefit of the loaders.
    deadliftFirstAttemptKg: 0.0
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "DELETE_REGISTRATION": {
      const entryId = action.entryId;

      // Remove the registration from the map, if present.
      let entriesHash = Object.assign({}, state.entriesHash);
      delete entriesHash[entryId];

      return {
        ...state,
        entriesHash: entriesHash
      };
    }

    default:
      return state;
  }
};
