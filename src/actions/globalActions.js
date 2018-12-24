// vim: set ts=2 sts=2 sw=2 et:

// Overwrites the entire Redux store, handled separately by each reducer.
// This is used to implement "Load from File" functionality.
export const overwriteStore = store => {
  return {
    type: "OVERWRITE_STORE",
    store: store
  };
};
