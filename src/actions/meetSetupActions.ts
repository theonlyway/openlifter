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
  SetMeetNameAction,
  SetFormulaAction,
  SetFederationAction,
  SetDivisionsAction,
  SetMeetDateAction,
  SetLengthDaysAction,
  SetPlatformsOnDaysAction,
  SetInKgAction,
  SetWeightClassesAction,
  SetBarAndCollarsWeightKgAction,
  SetPlateConfigAction,
  UpdateMeetAction,
} from "../types/actionTypes";
import { Formula, Lift, Sex } from "../types/dataTypes";
import { MeetState } from "../types/stateTypes";

export const setMeetName = (name: string): SetMeetNameAction => {
  return {
    type: "SET_MEET_NAME",
    name,
  };
};

export const setFormula = (formula: Formula): SetFormulaAction => {
  return {
    type: "SET_FORMULA",
    formula,
  };
};

export const setFederation = (federation: string): SetFederationAction => {
  return {
    type: "SET_FEDERATION",
    federation,
  };
};

export const setDivisions = (divisions: ReadonlyArray<string>): SetDivisionsAction => {
  return {
    type: "SET_DIVISIONS",
    divisions,
  };
};

export const setMeetDate = (date: string): SetMeetDateAction => {
  return {
    type: "SET_MEET_DATE",
    date,
  };
};

export const setLengthDays = (length: number): SetLengthDaysAction => {
  return {
    type: "SET_LENGTH_DAYS",
    length,
  };
};

export const setPlatformsOnDays = (day: number, count: number): SetPlatformsOnDaysAction => {
  return {
    type: "SET_PLATFORM_COUNT",
    day: day,
    count: count,
  };
};

export const setInKg = (inKg: boolean): SetInKgAction => {
  return {
    type: "SET_IN_KG",
    inKg,
  };
};

export const setWeightClasses = (sex: Sex, classesKg: ReadonlyArray<number>): SetWeightClassesAction => {
  return {
    type: "SET_WEIGHTCLASSES",
    sex: sex,
    classesKg: classesKg,
  };
};

export const setBarAndCollarsWeightKg = (lift: Lift, weightKg: number): SetBarAndCollarsWeightKgAction => {
  return {
    type: "SET_BAR_AND_COLLARS_WEIGHT_KG",
    lift: lift,
    weightKg: weightKg,
  };
};

export const setPlateConfig = (weightKg: number, pairCount: number, color: string): SetPlateConfigAction => {
  return {
    type: "SET_PLATE_CONFIG",
    weightKg,
    pairCount,
    color,
  };
};

export const updateMeet = (obj: Partial<MeetState>): UpdateMeetAction => {
  return {
    type: "UPDATE_MEET",
    changes: obj,
  };
};
