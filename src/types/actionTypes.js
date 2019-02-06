// vim: set ts=2 sts=2 sw=2 et:
// @flow strict
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

// Defines shared types produced by Redux actions.

import type { Entry, Formula, Lift, Sex } from "./dataTypes";
import type { GlobalState, MeetState } from "./stateTypes";

//////////////////////////////////////////////////////////
// Global Actions.
//////////////////////////////////////////////////////////

export interface OverwriteStoreAction {
  type: "OVERWRITE_STORE";
  store: GlobalState;
}

//////////////////////////////////////////////////////////
// Language Actions.
//////////////////////////////////////////////////////////

export interface ChangeLanguageAction {
  type: "CHANGE_LANGUAGE";
  language: string;
}

//////////////////////////////////////////////////////////
// MeetSetup Actions.
//////////////////////////////////////////////////////////

export interface SetMeetNameAction {
  type: "SET_MEET_NAME";
  name: string;
}

export interface SetFormulaAction {
  type: "SET_FORMULA";
  formula: Formula;
}

export interface SetFederationAction {
  type: "SET_FEDERATION";
  federation: string;
}

export interface SetDivisionsAction {
  type: "SET_DIVISIONS";
  divisions: Array<string>;
}

export interface SetMeetDateAction {
  type: "SET_MEET_DATE";
  date: Date;
}

export interface SetLengthDaysAction {
  type: "SET_LENGTH_DAYS";
  length: number;
}

export interface SetPlatformsOnDaysAction {
  type: "SET_PLATFORM_COUNT";
  day: number;
  count: number;
}

export interface SetInKgAction {
  type: "SET_IN_KG";
  inKg: boolean;
}

export interface SetWeightClassesAction {
  type: "SET_WEIGHTCLASSES";
  sex: Sex;
  classesKg: Array<number>;
}

export interface SetAreWrapsRawAction {
  type: "SET_ARE_WRAPS_RAW";
  areWrapsRaw: boolean;
}

export interface SetBarAndCollarsWeightKgAction {
  type: "SET_BAR_AND_COLLARS_WEIGHT_KG";
  weightKg: number;
}

export interface SetPlatePairCountAction {
  type: "SET_PLATE_PAIR_COUNT";
  weightKg: number;
  pairCount: number;
}

export interface UpdateMeetAction {
  type: "UPDATE_MEET";
  changes: $Shape<MeetState>;
}

export type MeetSetupAction =
  | SetMeetNameAction
  | SetFormulaAction
  | SetFederationAction
  | SetDivisionsAction
  | SetMeetDateAction
  | SetLengthDaysAction
  | SetPlatformsOnDaysAction
  | SetInKgAction
  | SetWeightClassesAction
  | SetAreWrapsRawAction
  | SetBarAndCollarsWeightKgAction
  | SetPlatePairCountAction
  | UpdateMeetAction;

//////////////////////////////////////////////////////////
// Registration Actions.
//////////////////////////////////////////////////////////

export interface NewRegistrationAction {
  type: "NEW_REGISTRATION";
  overwriteDefaults: $Shape<Entry>;
}

export interface DeleteRegistrationAction {
  type: "DELETE_REGISTRATION";
  entryId: number;
}

export interface UpdateRegistrationAction {
  type: "UPDATE_REGISTRATION";
  entryId: number;
  changes: $Shape<Entry>;
}

export type RegistrationAction = NewRegistrationAction | DeleteRegistrationAction | UpdateRegistrationAction;

//////////////////////////////////////////////////////////
// Lifting Actions.
//////////////////////////////////////////////////////////

export interface EnterAttemptAction {
  type: "ENTER_ATTEMPT";
  entryId: number;
  lift: Lift;
  attemptOneIndexed: number;
  weightKg: number;
}

export interface MarkLiftAction {
  type: "MARK_LIFT";
  entryId: number;
  lift: Lift;
  attemptOneIndexed: number;
  success: boolean;
}

export interface SetLiftingGroupAction {
  type: "SET_LIFTING_GROUP";
  day: number;
  platform: number;
  flight: string;
  lift: Lift;
}

export interface OverrideAttemptAction {
  type: "OVERRIDE_ATTEMPT";
  attempt: number;
}

export interface OverrideEntryIdAction {
  type: "OVERRIDE_ENTRY_ID";
  entryId: number;
}
