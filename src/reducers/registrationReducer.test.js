// vim: set ts=2 sts=2 sw=2 et:
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

import reducer, { getLiftersOnDay } from "./registrationReducer";

const initialState = {
  nextEntryId: 5000,
  entries: [],
  lookup: {}
};

describe("registrationReducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  /*
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
  */
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

  describe("getLiftersOnDay()", () => {
    it("is [] for no entries", () => {
      expect(getLiftersOnDay([], 1)).toEqual([]);
    });

    let entries = [
      {
        id: 5000,
        name: "Lifter One",
        day: 1
      },
      {
        id: 5001,
        name: "Lifter Two",
        day: 2
      }
    ];
    it("is [] with entries, but none on that day", () => {
      expect(getLiftersOnDay(entries, 9)).toEqual([]);
    });
    it("only returns entries that are on the given day", () => {
      expect(getLiftersOnDay(entries, 2)).toEqual([entries[1]]);
      expect(getLiftersOnDay(entries, 1)).toEqual([entries[0]]);
    });
  });
});
