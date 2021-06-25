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

// Lifting state only tracks manual overrides.
//
// Outside of overrides, the state of the meet is fully-calculated by the LiftingView.
//
// For safety, correctness, and ease of understanding, the state of the meet is
// intentionally *not* stored in the global state. It is continuously recalculated.
//
// Please do not attempt to store meet state in the Redux store!

import {
  MarkLiftAction,
  SetLiftingGroupAction,
  OverrideAttemptAction,
  OverrideEntryIdAction,
  OverwriteStoreAction,
  SetTableInfoAction,
} from "../types/actionTypes";
import { LiftingState } from "../types/stateTypes";
import { checkExhausted } from "../types/utils";

const initialState: LiftingState = {
  // Specifies the initial settings for the control widgets on the lifting page.
  // The intention is that the score table sets these manually.
  day: 1,
  platform: 1,
  flight: "A",
  lift: "S",

  // These properties are normally calculated, but exist here as a mechanism
  // for a one-shot override of the normal logic. After being handled,
  // they are unset.
  overrideAttempt: null, // Allows selecting an attempt, even if it's completed.
  overrideEntryId: null, // Allows selecting a lifter, even if they've already gone.

  // Presentational configuration.
  columnDivisionWidthPx: 90,
};

type Action =
  | MarkLiftAction
  | SetLiftingGroupAction
  | OverrideAttemptAction
  | OverrideEntryIdAction
  | OverwriteStoreAction
  | SetTableInfoAction;

export default function liftingReducer(state: LiftingState = initialState, action: Action): LiftingState {
  switch (action.type) {
    case "MARK_LIFT": {
      // Unset any overrides, returning to normal lifting flow.
      return { ...state, overrideAttempt: null, overrideEntryId: null };
    }

    case "SET_LIFTING_GROUP":
      return {
        // Keep all the UI customization stuff.
        ...state,

        // Change all the real state stuff.
        day: action.day,
        platform: action.platform,
        flight: action.flight,
        lift: action.lift,

        // If the group changes, unset any overrides.
        overrideAttempt: null,
        overrideEntryId: null,
      };

    case "OVERRIDE_ATTEMPT":
      return { ...state, overrideAttempt: action.attempt };

    case "OVERRIDE_ENTRY_ID":
      return { ...state, overrideEntryId: action.entryId };

    case "OVERWRITE_STORE":
      return action.store.lifting;

    case "SET_TABLE_INFO": {
      const changes = action.changes;

      // As a safeguard, ensure that fields unrelated to customization
      // are not overwritten by this action.

      // Make a new object that's state + changes, with changes taking priority.
      const combined = Object.assign({}, state);
      Object.assign(combined, changes);

      // Source from this new combined object, with fields unrelated to customization
      // deferring to the original state.
      //
      // So that means:
      //  - Fields unrelated to customization will be the same as in 'state'.
      //  - Customization fields will be from 'combined', which includes all fields
      //    and allowed the 'changes' object to overwrite any of them.
      return {
        ...combined,

        day: state.day,
        platform: state.platform,
        flight: state.flight,
        lift: state.lift,

        overrideAttempt: state.overrideAttempt,
        overrideEntryId: state.overrideEntryId,
      };
    }

    default:
      checkExhausted(action);
      return state;
  }
}
