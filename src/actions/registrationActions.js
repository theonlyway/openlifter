// vim: set ts=2 sts=2 sw=2 et:

// Adds a blank (or default-initalized) row to the registrations table.
export const newRegistration = obj => {
  return {
    type: "NEW_REGISTRATION",
    overwriteDefaults: obj
  };
};

// Deletes an existing entry from the registrations table.
//
// Corresponding data from the registration is *not* deleted, for example
// from the lifting page, but because the state.registrations.lookups map
// will no longer find an associated entry given a global unique EntryId,
// the data will simply stop being displayed.
//
// The global ID from the deleted entry is not recycled.
export const deleteRegistration = entryId => {
  return {
    type: "DELETE_REGISTRATION",
    entryId: entryId
  };
};

// Updates an existing entry in the registrations table.
//
// Because there are a lot of fields in a single entry, for the sake of
// simplicity, this is a general method that knows how to update the
// existing entry object with whatever has changed, as passed
// through object properties.
export const updateRegistration = (entryId, obj) => {
  return {
    type: "UPDATE_REGISTRATION",
    entryId: entryId,
    changes: obj
  };
};
