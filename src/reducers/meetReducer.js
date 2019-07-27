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

import { localDateToIso8601 } from "../logic/date";
import { kg2lbs, lbs2kg, displayWeight } from "../logic/units";
import { PlateColors } from "../constants/plateColors";

import type { MeetSetupAction, OverwriteStoreAction } from "../types/actionTypes";
import type { Plate } from "../types/dataTypes";
import type { MeetState } from "../types/stateTypes";

const defaultPlatformsOnDay = 1;

const defaultBarAndCollarsWeightKg = 25; // Assuming metal 2.5kg collars.
const defaultBarAndCollarsWeightLbs = 45; // Assuming plastic collars.

// Default kg plates, allowing for increments of 0.5kg.
const defaultPlatesKg: Array<Plate> = [
  { weightKg: 50, pairCount: 0, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 25, pairCount: 8, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: 20, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 15, pairCount: 1, color: PlateColors.PLATE_DEFAULT_YELLOW },
  { weightKg: 10, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 2.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 1.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 1, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 0.75, pairCount: 1, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: 0.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 0.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE }
];

// Default lbs plates, allowing for increments of 1lb.
const defaultPlatesLbs: Array<Plate> = [
  { weightKg: lbs2kg(100), pairCount: 0, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: lbs2kg(55), pairCount: 0, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: lbs2kg(45), pairCount: 8, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(35), pairCount: 0, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(25), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(10), pairCount: 2, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(5), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(2.5), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(1.25), pairCount: 1, color: PlateColors.PLATE_DEFAULT_GRAY },
  { weightKg: lbs2kg(0.5), pairCount: 2, color: PlateColors.PLATE_DEFAULT_GRAY }
];

const initialState: MeetState = {
  // Sanction information.
  name: "",
  country: "",
  state: "",
  city: "",
  federation: "",
  date: localDateToIso8601(new Date()),
  lengthDays: 1,
  platformsOnDays: [defaultPlatformsOnDay],

  // Competition Rules.
  divisions: [],
  weightClassesKgMen: [],
  weightClassesKgWomen: [],
  weightClassesKgMx: [],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: true,

  // Weights and Loading Setup.
  inKg: true,
  showAlternateUnits: true,
  squatBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
  benchBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
  deadliftBarAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
  plates: defaultPlatesKg
};

// Given a sorted list of weight classes (in kg) and a bodyweight (in kg),
// return a string describing the weight class.
export const getWeightClassStr = (classes: Array<number>, bodyweightKg: number): string => {
  if (bodyweightKg === 0) return "";
  if (classes.length === 0) return "";

  for (let i = 0; i < classes.length; i++) {
    if (bodyweightKg <= classes[i]) {
      return displayWeight(classes[i]);
    }
  }
  return displayWeight(classes[classes.length - 1]) + "+";
};

// Converts a kg weightclass to pounds.
//
// For example, the 90kg class is technically 198.41lbs,
// but this will return "198".
export const wtclsStrKg2Lbs = (kgcls: string): string => {
  const shw: boolean = kgcls.endsWith("+");
  const asNumber = Number(kgcls.replace("+", ""));

  // Convert to pounds and round down.
  let truncated = Math.floor(kg2lbs(asNumber));

  // This works for everything but the 183 class, which
  // rounds down to 182.
  if (truncated === 182) {
    truncated = 183;
  }

  return shw ? String(truncated) + "+" : String(truncated);
};

// Given a sorted list of weight classes (in kg) and a bodyweight (in kg),
// return a string describing the weight class.
//
// This is a separate method because it turns out that many exact translations
// of kilo values are not what the audience expects for traditionally-reported
// pounds classes. So a bunch of rounding must occur.
export const getWeightClassLbsStr = (classes: Array<number>, bodyweightKg: number): string => {
  if (bodyweightKg === 0) return "";
  if (classes.length === 0) return "";

  for (let i = 0; i < classes.length; i++) {
    if (bodyweightKg <= classes[i]) {
      return wtclsStrKg2Lbs(String(classes[i]));
    }
  }
  return wtclsStrKg2Lbs(String(classes[classes.length - 1])) + "+";
};

type Action = MeetSetupAction | OverwriteStoreAction;

export default (state: MeetState = initialState, action: Action): MeetState => {
  switch (action.type) {
    case "SET_MEET_NAME":
      return { ...state, name: action.name };

    case "SET_FORMULA":
      return { ...state, formula: action.formula };

    case "SET_FEDERATION":
      return { ...state, federation: action.federation };

    case "SET_DIVISIONS":
      return { ...state, divisions: action.divisions };

    case "SET_MEET_DATE":
      return { ...state, date: action.date };

    case "SET_LENGTH_DAYS": {
      const numDays = Number(action.length);

      if (numDays >= state.platformsOnDays.length) {
        const diff = numDays - state.platformsOnDays.length;

        let newPlatformsOnDays: Array<number> = state.platformsOnDays.slice();
        for (let i = 0; i < diff; i++) {
          newPlatformsOnDays.push(defaultPlatformsOnDay);
        }

        return { ...state, lengthDays: numDays, platformsOnDays: newPlatformsOnDays };
      }
      return { ...state, lengthDays: numDays };
    }

    case "SET_PLATFORM_COUNT": {
      const day = Number(action.day);
      const count = Number(action.count);

      let newPlatformsOnDays: Array<number> = state.platformsOnDays.slice();
      newPlatformsOnDays[day - 1] = count;
      return { ...state, platformsOnDays: newPlatformsOnDays };
    }

    case "SET_IN_KG": {
      // Changing the units also changes the loading, so re-initialize from defaults.
      const defaultPlates = action.inKg ? defaultPlatesKg : defaultPlatesLbs;
      const defaultBar = action.inKg ? defaultBarAndCollarsWeightKg : lbs2kg(defaultBarAndCollarsWeightLbs);
      return {
        ...state,
        inKg: action.inKg,
        plates: defaultPlates,
        squatBarAndCollarsWeightKg: defaultBar,
        benchBarAndCollarsWeightKg: defaultBar,
        deadliftBarAndCollarsWeightKg: defaultBar
      };
    }

    case "SET_WEIGHTCLASSES": {
      const sex = action.sex;
      const classesKg = action.classesKg;
      switch (sex) {
        case "M":
          return { ...state, weightClassesKgMen: classesKg };
        case "F":
          return { ...state, weightClassesKgWomen: classesKg };
        case "Mx":
          return { ...state, weightClassesKgMx: classesKg };
        default:
          (sex: empty) // eslint-disable-line
          return state;
      }
    }

    case "SET_BAR_AND_COLLARS_WEIGHT_KG": {
      switch (action.lift) {
        case "S":
          return { ...state, squatBarAndCollarsWeightKg: action.weightKg };
        case "B":
          return { ...state, benchBarAndCollarsWeightKg: action.weightKg };
        case "D":
          return { ...state, deadliftBarAndCollarsWeightKg: action.weightKg };
        default:
          (action.lift: empty) // eslint-disable-line
          return state;
      }
    }

    case "SET_PLATE_CONFIG": {
      const { weightKg, pairCount, color } = action;

      // Find the index of the object in the platesOnSide array by comparing weights.
      const index = state.plates.findIndex(p => p.weightKg === weightKg);

      // Clone the array.
      let newPlates: Array<Plate> = state.plates.slice();

      // Replace with a new object in the new array.
      newPlates[index] = { weightKg, pairCount, color };

      return { ...state, plates: newPlates };
    }

    case "UPDATE_MEET": {
      const changes = action.changes;

      // Make a new MeetState with just the changes overwritten.
      let newState = Object.assign({}, state);
      return Object.assign(newState, changes);
    }

    case "OVERWRITE_STORE":
      return action.store.meet;

    default:
      (action.type: empty); // eslint-disable-line
      return state;
  }
};
