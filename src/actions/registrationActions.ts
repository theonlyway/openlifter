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
  NewRegistrationAction,
  DeleteRegistrationAction,
  UpdateRegistrationAction,
  MergePlatformAction,
  AssignLotNumbersAction,
} from "../types/actionTypes";
import { Entry } from "../types/dataTypes";

// Adds a blank (or default-initalized) row to the registrations table.
export const newRegistration = (obj: Partial<Entry>): NewRegistrationAction => {
  return {
    type: "NEW_REGISTRATION",
    overwriteDefaults: obj,
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
export const deleteRegistration = (entryId: number): DeleteRegistrationAction => {
  return {
    type: "DELETE_REGISTRATION",
    entryId: entryId,
  };
};

// Updates an existing entry in the registrations table.
//
// Because there are a lot of fields in a single entry, for the sake of
// simplicity, this is a general method that knows how to update the
// existing entry object with whatever has changed, as passed
// through object properties.
export const updateRegistration = (entryId: number, obj: Partial<Entry>): UpdateRegistrationAction => {
  return {
    type: "UPDATE_REGISTRATION",
    entryId: entryId,
    changes: obj,
  };
};

// Deletes all entries assigned to a given (day, platform), and then adds entries
// assigned to that (day, platform) from a foreign save state.
export const mergePlatform = (day: number, platform: number, platformEntries: Array<Entry>): MergePlatformAction => {
  return {
    type: "MERGE_PLATFORM",
    day: day,
    platform: platform,
    platformEntries: platformEntries,
  };
};

export const assignLotNumbers = (lotNumbers: number[]): AssignLotNumbersAction => {
  return {
    type: "ASSIGN_LOT_NUMBERS",
    lotNumbers,
  };
};
