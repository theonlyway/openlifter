// vim: set ts=2 sts=2 sw=2 et:

// Adds a blank (or default-initalized) row to the registrations table.
export const newDefaultRegistration = () => {
  return {
    type: "NEW_DEFAULT_REGISTRATION"
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
}
