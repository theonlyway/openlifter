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

// Wraps all the points functions into a common interface.

import { ah } from "./ah";
import { bodyweight_multiple } from "./bodyweight-multiple";
import { dots } from "./dots";
import { fosterMcCulloch } from "./foster-mcculloch";
import { glossbrenner } from "./glossbrenner";
import { goodlift } from "./goodlift";
import { ipfpoints } from "./ipf";
import { nasapoints } from "./nasa";
import { reshel } from "./reshel";
import { schwartzmalone } from "./schwartzmalone";
import { wilks } from "./wilks";
import { wilks2020 } from "./wilks2020";

import { getAge } from "../entry";
import { kg2lbs } from "../units";

import { AgeCoefficients, Entry, Event, Equipment, Formula, Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

export const getPoints = (formula: Formula, entry: Entry, event: Event, totalKg: number, inKg: boolean): number => {
  // Some of the data are singular properties of the entry.
  const sex: Sex = entry.sex;
  const equipment: Equipment = entry.equipment;
  const bodyweightKg: number = entry.bodyweightKg;

  switch (formula) {
    case "AH":
      return ah(sex, bodyweightKg, totalKg);
    case "Bodyweight Multiple":
      return bodyweight_multiple(bodyweightKg, totalKg);
    case "Dots":
      return dots(sex, bodyweightKg, totalKg);
    case "Glossbrenner":
      return glossbrenner(sex, bodyweightKg, totalKg);
    case "IPF GL Points":
      return goodlift(totalKg, bodyweightKg, sex, equipment, event);
    case "IPF Points":
      return ipfpoints(totalKg, bodyweightKg, sex, equipment, event);
    case "NASA Points":
      return nasapoints(bodyweightKg, totalKg);
    case "Reshel":
      return reshel(sex, bodyweightKg, totalKg);
    case "Schwartz/Malone":
      return schwartzmalone(sex, bodyweightKg, totalKg);
    case "Total":
      return inKg ? totalKg : kg2lbs(totalKg);
    case "Wilks":
      return wilks(sex, bodyweightKg, totalKg);
    case "Wilks2020":
      return wilks2020(sex, bodyweightKg, totalKg);
    default:
      checkExhausted(formula);
      return 0;
  }
};

export const getAgeAdjustedPoints = (
  ageCoefficients: AgeCoefficients,
  meetDate: string,
  formula: Formula,
  entry: Entry,
  event: Event,
  totalKg: number,
  inKg: boolean,
): number => {
  const points = getPoints(formula, entry, event, totalKg, inKg);

  switch (ageCoefficients) {
    case "None":
      return points;
    case "FosterMcCulloch":
      return fosterMcCulloch(getAge(entry, meetDate)) * points;
    default:
      checkExhausted(ageCoefficients);
      return 0;
  }
};
