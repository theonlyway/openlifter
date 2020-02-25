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

// Defines shared types produced by Redux actions.

import { Entry, Flight, Formula, Language, Lift, Sex } from "./dataTypes";
import { GlobalState, MeetState, LiftingState } from "./stateTypes";

//////////////////////////////////////////////////////////
// Global Actions.
//////////////////////////////////////////////////////////

export interface OverwriteStoreAction {
  readonly type: "OVERWRITE_STORE";
  readonly store: GlobalState;
}

//////////////////////////////////////////////////////////
// Language Actions.
//////////////////////////////////////////////////////////

export interface ChangeLanguageAction {
  readonly type: "CHANGE_LANGUAGE";
  readonly language: Language;
}

//////////////////////////////////////////////////////////
// MeetSetup Actions.
//////////////////////////////////////////////////////////

export interface SetMeetNameAction {
  readonly type: "SET_MEET_NAME";
  readonly name: string;
}

export interface SetFormulaAction {
  readonly type: "SET_FORMULA";
  readonly formula: Formula;
}

export interface SetFederationAction {
  readonly type: "SET_FEDERATION";
  readonly federation: string;
}

export interface SetDivisionsAction {
  readonly type: "SET_DIVISIONS";
  readonly divisions: ReadonlyArray<string>;
}

export interface SetMeetDateAction {
  readonly type: "SET_MEET_DATE";
  readonly date: string;
}

export interface SetLengthDaysAction {
  readonly type: "SET_LENGTH_DAYS";
  readonly length: number;
}

export interface SetPlatformsOnDaysAction {
  readonly type: "SET_PLATFORM_COUNT";
  readonly day: number;
  readonly count: number;
}

export interface SetInKgAction {
  readonly type: "SET_IN_KG";
  readonly inKg: boolean;
}

export interface SetWeightClassesAction {
  readonly type: "SET_WEIGHTCLASSES";
  readonly sex: Sex;
  readonly classesKg: ReadonlyArray<number>;
}

export interface SetBarAndCollarsWeightKgAction {
  readonly type: "SET_BAR_AND_COLLARS_WEIGHT_KG";
  readonly lift: Lift;
  readonly weightKg: number;
}

export interface SetPlateConfigAction {
  readonly type: "SET_PLATE_CONFIG";
  readonly weightKg: number;
  readonly pairCount: number;
  readonly color: string;
}

export interface UpdateMeetAction {
  readonly type: "UPDATE_MEET";
  readonly changes: Partial<MeetState>;
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
  | SetBarAndCollarsWeightKgAction
  | SetPlateConfigAction
  | UpdateMeetAction;

//////////////////////////////////////////////////////////
// Registration Actions.
//////////////////////////////////////////////////////////

export interface NewRegistrationAction {
  readonly type: "NEW_REGISTRATION";
  readonly overwriteDefaults: Partial<Entry>;
}

export interface DeleteRegistrationAction {
  readonly type: "DELETE_REGISTRATION";
  readonly entryId: number;
}

export interface UpdateRegistrationAction {
  readonly type: "UPDATE_REGISTRATION";
  readonly entryId: number;
  readonly changes: Partial<Entry>;
}

export interface MergePlatformAction {
  readonly type: "MERGE_PLATFORM";
  readonly day: number;
  readonly platform: number;
  readonly platformEntries: ReadonlyArray<Entry>;
}

export interface AssignLotNumbersAction {
  readonly type: "ASSIGN_LOT_NUMBERS";
  readonly lotNumbers: number[];
}

export type RegistrationAction =
  | NewRegistrationAction
  | DeleteRegistrationAction
  | UpdateRegistrationAction
  | AssignLotNumbersAction
  | MergePlatformAction;

//////////////////////////////////////////////////////////
// Lifting Actions.
//////////////////////////////////////////////////////////

export interface EnterAttemptAction {
  readonly type: "ENTER_ATTEMPT";
  readonly entryId: number;
  readonly lift: Lift;
  readonly attemptOneIndexed: number;
  readonly weightKg: number;
}

export interface MarkLiftAction {
  readonly type: "MARK_LIFT";
  readonly entryId: number;
  readonly lift: Lift;
  readonly attemptOneIndexed: number;
  readonly success: boolean;
}

export interface SetLiftingGroupAction {
  readonly type: "SET_LIFTING_GROUP";
  readonly day: number;
  readonly platform: number;
  readonly flight: Flight;
  readonly lift: Lift;
}

export interface OverrideAttemptAction {
  readonly type: "OVERRIDE_ATTEMPT";
  readonly attempt: number;
}

export interface OverrideEntryIdAction {
  readonly type: "OVERRIDE_ENTRY_ID";
  readonly entryId: number;
}

export interface SetTableInfoAction {
  readonly type: "SET_TABLE_INFO";
  readonly changes: Partial<LiftingState>;
}
