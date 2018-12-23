// vim: set ts=2 sts=2 sw=2 et:

const initialState = {
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
  lookup: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
