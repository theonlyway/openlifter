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

import type {
  SetMeetNameAction,
  SetFormulaAction,
  SetFederationAction,
  SetDivisionsAction,
  SetMeetDateAction,
  SetLengthDaysAction,
  SetPlatformsOnDaysAction,
  SetInKgAction,
  SetWeightClassesAction,
  SetAreWrapsRawAction,
  SetBarAndCollarsWeightKgAction,
  SetPlatePairCountAction,
  UpdateMeetAction
} from "../types/actionTypes";
import type { Formula, Sex } from "../types/dataTypes";
import type { MeetState } from "../types/stateTypes";

export const setMeetName = (name: string): SetMeetNameAction => {
  return {
    type: "SET_MEET_NAME",
    name
  };
};

export const setFormula = (formula: Formula): SetFormulaAction => {
  return {
    type: "SET_FORMULA",
    formula
  };
};

export const setFederation = (federation: string): SetFederationAction => {
  return {
    type: "SET_FEDERATION",
    federation
  };
};

export const setDivisions = (divisions: Array<string>): SetDivisionsAction => {
  return {
    type: "SET_DIVISIONS",
    divisions
  };
};

export const setMeetDate = (date: Date): SetMeetDateAction => {
  return {
    type: "SET_MEET_DATE",
    date
  };
};

export const setLengthDays = (length: number): SetLengthDaysAction => {
  return {
    type: "SET_LENGTH_DAYS",
    length
  };
};

export const setPlatformsOnDays = (day: number, count: number): SetPlatformsOnDaysAction => {
  return {
    type: "SET_PLATFORM_COUNT",
    day: day,
    count: count
  };
};

export const setInKg = (inKg: boolean): SetInKgAction => {
  return {
    type: "SET_IN_KG",
    inKg
  };
};

export const setWeightClasses = (sex: Sex, classesKg: Array<number>): SetWeightClassesAction => {
  return {
    type: "SET_WEIGHTCLASSES",
    sex: sex,
    classesKg: classesKg
  };
};

export const setAreWrapsRaw = (areWrapsRaw: boolean): SetAreWrapsRawAction => {
  return {
    type: "SET_ARE_WRAPS_RAW",
    areWrapsRaw
  };
};

export const setBarAndCollarsWeightKg = (weightKg: number): SetBarAndCollarsWeightKgAction => {
  return {
    type: "SET_BAR_AND_COLLARS_WEIGHT_KG",
    weightKg: weightKg
  };
};

export const setPlatePairCount = (weightKg: number, pairCount: number): SetPlatePairCountAction => {
  return {
    type: "SET_PLATE_PAIR_COUNT",
    weightKg,
    pairCount
  };
};

export const updateMeet = (obj: $Shape<MeetState>): UpdateMeetAction => {
  return {
    type: "UPDATE_MEET",
    changes: obj
  };
};
