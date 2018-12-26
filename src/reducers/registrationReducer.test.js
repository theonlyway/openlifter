// vim: set ts=2 sts=2 sw=2 et:

import reducer from "./registrationReducer";

const initialState = {
  nextEntryId: 5000,
  entries: [],
  lookup: {}
};

describe("registrationReducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it("handles NEW_DEFAULT_REGISTRATION", () => {
    const newState = reducer(initialState, {
      type: "NEW_DEFAULT_REGISTRATION"
    });
    // After the reducer runs, it should have an entry
    expect(newState.entries).toBeDefined();
    expect(newState.entries.length === 1).toBeTruthy();
    // The next id should be 1 higher than the id of the initial state
    expect(newState.nextEntryId).toEqual(initialState.nextEntryId + 1);
    // There should be a lookup defined with the original id
    expect(newState.lookup).toBeDefined();
    expect(newState.lookup.hasOwnProperty(initialState.nextEntryId)).toBeTruthy();
  });
  it("handles DELETE_REGISTRATION", () => {
    // Small subset of the state containing relevant parts
    // We'll use this so we can see which item was deleted after the reducer runs
    let preDeleteState = {
      nextEntryId: 5002,
      entries: [
        {
          id: 5001
        },
        {
          id: 5000
        }
      ],
      lookup: {
        "5000": 1,
        "5001": 0
      }
    };

    // First we'll do a "delete" on an id that doesn't actually exist
    const unchangedState = reducer(preDeleteState, {
      type: "DELETE_REGISTRATION",
      entryId: 9999
    });

    // It shouldn't invalidate the entries
    expect(unchangedState.entries).toBeDefined();
    // The id didn't exist, so the state should be unchanged
    expect(unchangedState.entries).toEqual(preDeleteState.entries);

    // Now let's actually delete an entry
    const newState = reducer(preDeleteState, {
      type: "DELETE_REGISTRATION",
      entryId: 5000
    });

    // There should be one less entry
    expect(newState.entries.length).toEqual(preDeleteState.entries.length - 1);
    // The given ID for deletion should no longer be present
    expect(newState.entries[0].id).toEqual(5001);
    // There should no longer be a lookup value for the given ID
    expect(newState.lookup.hasOwnProperty("5000")).toBeFalsy();
  });
  it("handles UPDATE_REGISTRATION", () => {
    // Define a basic state that we can make updates to for testing
    let preUpdateState = {
      nextEntryId: 5002,
      entries: [
        {
          id: 5001,
          name: "Rudolph Reindeer",
          paid: true
        },
        {
          id: 5000,
          name: "Santa Claus",
          paid: false
        }
      ],
      lookup: {
        "5000": 1,
        "5001": 0
      }
    };

    let newState = reducer(preUpdateState, {
      type: "UPDATE_REGISTRATION",
      entryId: 5000,
      changes: {}
    });

    // return the same object given no changes
    expect(newState).toEqual(preUpdateState);

    newState = reducer(preUpdateState, {
      type: "UPDATE_REGISTRATION",
      entryId: 5000,
      changes: {
        name: "Changed name"
      }
    });
    // return the object with only the given field modified
    let changedEntry = newState.entries[1];
    expect(changedEntry.id).toEqual(preUpdateState.entries[1].id);
    expect(changedEntry.paid).toEqual(preUpdateState.entries[1].paid);
    expect(changedEntry.name).toEqual("Changed name");

    newState = reducer(newState, {
      type: "UPDATE_REGISTRATION",
      entryId: 5000,
      changes: {
        name: "Changed name again",
        paid: true
      }
    });

    // Should perform a second update and maintain changes from previous updates
    changedEntry = newState.entries[1];
    expect(changedEntry.id).toEqual(preUpdateState.entries[1].id);
    expect(changedEntry.paid).toEqual(true);
    expect(changedEntry.name).toEqual("Changed name again");

    // The other entry should have remained untouched
    expect(newState.entries[0]).toEqual(preUpdateState.entries[0]);
  });
});
