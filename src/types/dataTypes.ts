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

// Defines all the project-wide data types in a single place.

import translations from "../translations";
export type Language = keyof typeof translations;
export type TranslationId = keyof typeof translations.en;

export type Equipment = "Bare" | "Sleeves" | "Wraps" | "Single-ply" | "Multi-ply" | "Unlimited";
export type Event = "S" | "B" | "D" | "SB" | "SD" | "BD" | "SBD";
export type Flight = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P";
export type Formula =
  | "AH"
  | "Bodyweight Multiple"
  | "Dots"
  | "Glossbrenner"
  | "IPF GL Points"
  | "IPF Points"
  | "NASA Points"
  | "Reshel"
  | "Schwartz/Malone"
  | "Total"
  | "Wilks"
  | "Wilks2020";
export type AgeCoefficients = "None" | "FosterMcCulloch";
export type Lift = "S" | "B" | "D";

// Mx (pronounced "Muks" or "Miks") is an honorific that does not indicate gender.
//
// Powerlifting federations use Mx for lifters who do not neatly fall into M or F
// categories. It is typically used as a category for transgender athletes.
export type Sex = "M" | "F" | "Mx";

export type LiftStatus =
  | -1 // Failure.
  | 0 // Not yet taken.
  | 1; // Success.

// Used for mapping Lift -> entry[fieldKg].
export type FieldKg = "squatKg" | "benchKg" | "deadliftKg";

// Used for mapping Lift -> entry[fieldStatus].
export type FieldStatus = "squatStatus" | "benchStatus" | "deadliftStatus";

export type Entry = {
  id: number;
  day: number;
  platform: number;
  flight: Flight;
  name: string;
  sex: Sex;
  birthDate: string;
  age: number;
  country: string;
  state: string;
  intendedWeightClassKg: string;
  equipment: Equipment;
  divisions: Array<string>;
  events: Array<Event>;
  lot: number;
  memberId: string;
  paid: boolean;
  team: string;
  guest: boolean;
  instagram?: string; // Optional to maintain dataVersion compat.
  notes: string;
  bodyweightKg: number;
  squatRackInfo: string;
  benchRackInfo: string;
  squatKg: Array<number>;
  benchKg: Array<number>;
  deadliftKg: Array<number>;
  squatStatus: Array<LiftStatus>;
  benchStatus: Array<LiftStatus>;
  deadliftStatus: Array<LiftStatus>;
};

// Represents a plate in the configuration.
export type Plate = {
  weightKg: number;
  pairCount: number;
  color: string; // Hexadecimal color code.
};

// Represents a single plate loaded on the bar, for the BarLoad component.
export type LoadedPlate = {
  weightAny: number; // The weight used for display, kg or pounds.
  isAlreadyLoaded: boolean; // Used for diffs: if true, it's rendered faintly.
  color: string; // Hexadecimal color code.
};

export type LiftingOrder = {
  orderedEntries: Array<Entry>;
  attemptOneIndexed: number;
  currentEntryId: number | null;
  nextAttemptOneIndexed: number | null;
  nextEntryId: number | null;
};

// Type used for FormGroup validation.
export type Validation = null | "success" | "warning" | "error";
