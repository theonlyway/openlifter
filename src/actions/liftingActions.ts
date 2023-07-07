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

import {
  EnterAttemptAction,
  MarkLiftAction,
  SetLiftingGroupAction,
  OverrideAttemptAction,
  OverrideEntryIdAction,
  SetTableInfoAction,
} from "../types/actionTypes";
import { Flight, Lift } from "../types/dataTypes";
import { LiftingState } from "../types/stateTypes";

// Sets a weightKg that doesn't have a good/failed value, for entering in attempts.
export const enterAttempt = (
  entryId: number,
  lift: Lift,
  attemptOneIndexed: number,
  weightKg: number,
): EnterAttemptAction => {
  return {
    type: "ENTER_ATTEMPT",
    entryId: entryId,
    lift: lift,
    attemptOneIndexed: attemptOneIndexed,
    weightKg: weightKg,
  };
};

// Marks a lift "good" or "failed".
//
// entryId is the ID of the affected entry, a Number.
// lift is "S", "B", or "D".
// attempt is 1,2,3, etc., up to MAX_ATTEMPTS.
// success is a bool for whether to mark the lift as a success or as a failure.
export const markLift = (entryId: number, lift: Lift, attemptOneIndexed: number, success: boolean): MarkLiftAction => {
  return {
    type: "MARK_LIFT",
    entryId: entryId,
    lift: lift,
    attemptOneIndexed: attemptOneIndexed,
    success: success,
  };
};

// Sets the current group of lifters.
// This is always manually set by the score table.
export const setLiftingGroup = (day: number, platform: number, flight: Flight, lift: Lift): SetLiftingGroupAction => {
  return {
    type: "SET_LIFTING_GROUP",
    day: day,
    platform: platform,
    flight: flight,
    lift: lift,
  };
};

// Overrides the calculated meet progress logic by forcing display of an attempt,
// even if it has already been marked "good lift" or "no lift".
export const overrideAttempt = (attempt: number): OverrideAttemptAction => {
  return {
    type: "OVERRIDE_ATTEMPT",
    attempt: attempt,
  };
};

// Overrides the calculated meet progress logic by forcing display of a specific lifter,
// even if they have already had their attempt entered.
export const overrideEntryId = (entryId: number): OverrideEntryIdAction => {
  return {
    type: "OVERRIDE_ENTRY_ID",
    entryId: entryId,
  };
};

// Updates arbitrary fields in the LiftingState.
//
// The intention is to use action just for table customization: things like
// column widths, column visibility, and other such options.
//
// Having this interface lets us keep the number of actions low: separate
// actions for each kind of modification is not really useful.
export const setTableInfo = (obj: Partial<LiftingState>): SetTableInfoAction => {
  return {
    type: "SET_TABLE_INFO",
    changes: obj,
  };
};
