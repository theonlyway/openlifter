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

import { newDefaultEntry, liftToAttemptFieldName, liftToStatusFieldName } from "../logic/entry";
import { RegistrationAction, OverwriteStoreAction, EnterAttemptAction, MarkLiftAction } from "../types/actionTypes";
import { Entry, Lift, FieldKg } from "../types/dataTypes";
import { RegistrationState } from "../types/stateTypes";
import { checkExhausted } from "../types/utils";

const initialState: RegistrationState = {
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
  lookup: {},
};

type Action = RegistrationAction | EnterAttemptAction | MarkLiftAction | OverwriteStoreAction;

type NumberLookup = {
  [id: number]: number;
};

export default (state: RegistrationState = initialState, action: Action): RegistrationState => {
  switch (action.type) {
    case "NEW_REGISTRATION": {
      // The object provides optional properties that can overwrite the default.
      // Although the UI doesn't pass properties this way, debugging code does.
      const obj = action.overwriteDefaults;

      // Generate an entries array with one more item (without modifying the orginal).
      // Object.assign() allows `obj` to overwrite defaults if present.
      const entries: Array<Entry> = state.entries.slice();
      const newEntry = newDefaultEntry(state.nextEntryId);

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
      // Specify type explicitly here so that we can mutate it
      const lookup: NumberLookup = Object.assign({}, state.lookup);
      lookup[state.nextEntryId] = entries.length - 1;

      return {
        ...state,
        nextEntryId: state.nextEntryId + 1,
        entries: entries,
        lookup: lookup,
      };
    }

    case "DELETE_REGISTRATION": {
      const entryId = action.entryId;

      // Generate an entries array without the given item.
      const entries: Array<Entry> = state.entries.filter((item) => item.id !== entryId);

      // Since the entry was deleted from anywhere in the array,
      // construct a new lookup table from scratch.
      const lookup: NumberLookup = {};

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        lookup[entry.id] = i;
      }

      return {
        ...state,
        entries: entries,
        lookup: lookup,
      };
    }

    case "UPDATE_REGISTRATION": {
      const entryId = action.entryId;
      const changes = action.changes;

      // Clone the entries array, since one entry will reference a new object.
      const entries: Array<Entry> = state.entries.slice();

      // Make a new object with just the changes overwritten,
      // and reference that object from the new array.
      const index = entries.findIndex((obj) => obj.id === entryId);
      const newEntry = Object.assign({}, entries[index]);
      entries[index] = Object.assign(newEntry, changes);

      return {
        ...state,
        entries: entries,
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
      const newEntries: Array<Entry> = state.entries.slice();
      const index = newEntries.findIndex((obj) => obj.id === entryId);
      const oldEntry = newEntries[index];

      // Make a copy of the attempts array containing the new attempt.
      const newarray = oldEntry[field].slice();
      newarray[attemptOneIndexed - 1] = weightKg;

      // Put that new attempts array into an object so we can use Object.assign().
      const newfields: Partial<Entry> = {};
      newfields[field] = newarray;

      // Make a new entry from the old entry, with the attempts field overwritten.
      newEntries[index] = Object.assign(oldEntry, newfields);

      return {
        ...state,
        entries: newEntries,
      };
    }

    case "MARK_LIFT": {
      const entryId = action.entry.id;
      const lift: Lift = action.lift;
      const attemptOneIndexed = Number(action.attemptOneIndexed);
      const success = Boolean(action.success);

      // Map true to '1' and false to '-1'.
      const status = success === true ? 1 : -1;

      const fieldStatus = liftToStatusFieldName(lift);

      // Clone the entries array, since one slot will reference a new object.
      const newEntries: Array<Entry> = state.entries.slice();
      const index = newEntries.findIndex((obj) => obj.id === entryId);
      const oldEntry = newEntries[index];

      // Make a copy of the status array containing the new status.
      const newarray = oldEntry[fieldStatus].slice();
      newarray[attemptOneIndexed - 1] = status;

      // Put that new array into an object so we can use Object.assign().
      const newfields: Partial<Entry> = {};
      newfields[fieldStatus] = newarray;

      // Make a new entry from the old entry, with the status field overwritten.
      const newEntry = Object.assign({}, oldEntry);
      newEntries[index] = Object.assign(newEntry, newfields);

      return {
        ...state,
        entries: newEntries,
      };
    }

    // Caused by clicking a "Merge" button on the Results page.
    case "MERGE_PLATFORM": {
      const day: number = action.day;
      const platform: number = action.platform;
      const platformEntries: ReadonlyArray<Entry> = action.platformEntries;

      // Filter out state entries assigned to the merged (day, platform).
      const newEntries = state.entries.filter((e) => {
        return !(e.day === day && e.platform === platform);
      });

      // Get the nextEntryId: the merged entries will be reassigned IDs.
      let nextEntryId: number = state.nextEntryId;

      // For each incoming Entry, copy the object, assign a new ID,
      // and place it in the newEntries array.
      for (let i = 0; i < platformEntries.length; i++) {
        const entry: Entry = Object.assign({}, platformEntries[i]);
        entry.id = nextEntryId++;
        newEntries.push(entry);
      }

      // Generate an entirely new lookup table.
      const lookup: NumberLookup = {};
      for (let i = 0; i < newEntries.length; i++) {
        lookup[newEntries[i].id] = i;
      }

      // Return a new object with the new components replaced.
      return {
        ...state,
        nextEntryId: nextEntryId,
        entries: newEntries,
        lookup: lookup,
      };
    }

    case "OVERWRITE_STORE":
      return action.store.registration;

    case "ASSIGN_LOT_NUMBERS":
      // Clone & assign entry with its new lot number.
      const updatedEntries = state.entries.map((entry, index) => ({ ...entry, lot: action.lotNumbers[index] }));

      return {
        ...state,
        entries: updatedEntries,
      };

    default:
      checkExhausted(action);
      return state;
  }
};
