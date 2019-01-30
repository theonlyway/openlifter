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

import type { MeetSetupAction, OverwriteStoreAction } from "../types/actionTypes";
import type { PlatePairCount } from "../types/dataTypes";
import type { MeetState } from "../types/stateTypes";

const defaultPlatformsOnDay = 1;

const defaultBarAndCollarsWeightKg = 25; // Assuming metal 2.5kg collars.
const defaultBarAndCollarsWeightLbs = 45; // Assuming plastic collars.

// Default kg plates, allowing for increments of 0.5kg.
const defaultPlatePairCountsKg: Array<PlatePairCount> = [
  { weightKg: 50, pairCount: 0 },
  { weightKg: 25, pairCount: 8 },
  { weightKg: 20, pairCount: 1 },
  { weightKg: 15, pairCount: 1 },
  { weightKg: 10, pairCount: 1 },
  { weightKg: 5, pairCount: 1 },
  { weightKg: 2.5, pairCount: 1 },
  { weightKg: 1.25, pairCount: 1 },
  { weightKg: 1, pairCount: 1 },
  { weightKg: 0.75, pairCount: 1 },
  { weightKg: 0.5, pairCount: 1 },
  { weightKg: 0.25, pairCount: 1 }
];

const kg = 2.20462262;

// Default lbs plates, allowing for increments of 1lb.
const defaultPlatePairCountsLbs: Array<PlatePairCount> = [
  { weightKg: 45 / kg, pairCount: 8 },
  { weightKg: 35 / kg, pairCount: 0 },
  { weightKg: 25 / kg, pairCount: 1 },
  { weightKg: 10 / kg, pairCount: 2 },
  { weightKg: 5 / kg, pairCount: 1 },
  { weightKg: 2.5 / kg, pairCount: 1 },
  { weightKg: 1.25 / kg, pairCount: 1 },
  { weightKg: 0.5 / kg, pairCount: 2 }
];

const initialState: MeetState = {
  name: "",
  formula: "Wilks",
  federation: "",
  date: getDateString(new Date()),
  lengthDays: 1,
  platformsOnDays: [defaultPlatformsOnDay],
  divisions: [],
  weightClassesKgMen: [],
  weightClassesKgWomen: [],
  inKg: true,
  areWrapsRaw: false,
  country: "",
  state: "",
  city: "",
  barAndCollarsWeightKg: defaultBarAndCollarsWeightKg,
  platePairCounts: defaultPlatePairCountsKg
};

function getDateString(dateTime) {
  return [dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()].join("/");
}

// Given a sorted list of weight classes (in kg) and a bodyweight (in kg),
// return a string describing the weight class.
export const getWeightClassStr = (classes: Array<number>, bodyweightKg: number) => {
  if (classes.length === 0) return "0+";

  for (let i = 0; i < classes.length; i++) {
    if (bodyweightKg <= classes[i]) {
      return String(classes[i]);
    }
  }
  return String(classes[classes.length - 1]) + "+";
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
      return { ...state, date: getDateString(action.date) };

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
      const defaultPlates = action.inKg ? defaultPlatePairCountsKg : defaultPlatePairCountsLbs;
      const defaultBar = action.inKg ? defaultBarAndCollarsWeightKg : defaultBarAndCollarsWeightLbs / kg;
      return { ...state, inKg: action.inKg, platesOnSide: defaultPlates, barAndCollarsWeightKg: defaultBar };
    }

    case "SET_WEIGHTCLASSES": {
      const sex = action.sex;
      const classesKg = action.classesKg;
      if (sex === "M") {
        return { ...state, weightClassesKgMen: classesKg };
      }
      return { ...state, weightClassesKgWomen: classesKg };
    }

    case "SET_ARE_WRAPS_RAW":
      return { ...state, areWrapsRaw: action.areWrapsRaw };

    case "SET_MEET_COUNTRY":
      return { ...state, country: action.country };

    case "SET_MEET_STATE":
      return { ...state, state: action.state };

    case "SET_MEET_CITY":
      return { ...state, city: action.city };

    case "SET_BAR_AND_COLLARS_WEIGHT_KG": {
      return { ...state, barAndCollarsWeightKg: action.weightKg };
    }

    case "SET_PLATE_PAIR_COUNT": {
      const { weightKg, pairCount } = action;

      // Find the index of the object in the platesOnSide array by comparing weights.
      const index = state.platePairCounts.findIndex(p => p.weightKg === weightKg);

      // Clone the array.
      let newPlates: Array<PlatePairCount> = state.platePairCounts.slice();

      // Replace with a new object in the new array.
      newPlates[index] = { weightKg, pairCount };

      return { ...state, platePairCounts: newPlates };
    }

    case "OVERWRITE_STORE": {
      // Copy all the state objects into an empty object.
      let obj = Object.assign({}, state);

      // Copy in the action's objects, overwriting the state's objects.
      return Object.assign(obj, action.store.meet);
    }

    default:
      (action.type: empty); // eslint-disable-line
      return state;
  }
};
