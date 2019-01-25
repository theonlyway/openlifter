// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

export type Equipment = "Raw" | "Wraps" | "Single-ply" | "Multi-ply";
export type Event = "S" | "B" | "D" | "SB" | "SD" | "BD" | "SBD";
export type Formula = "Glossbrenner" | "IPF Points" | "Wilks";
export type Lift = "S" | "B" | "D";
export type Sex = "M" | "F";

export type LiftStatus =
  | -1 // Failure.
  | 0 // Not yet taken.
  | 1; // Success.

export type Entry = {
  id: number,
  day: number,
  platform: number,
  flight: string,
  name: string,
  sex: Sex,
  birthDate: string,
  age: number,
  intendedWeightClassKg: string,
  equipment: Equipment,
  divisions: Array<string>,
  events: Array<Event>,
  lot: number,
  paid: boolean,
  bodyweightKg: number,
  squatRackInfo: string,
  benchRackInfo: string,
  squatKg: Array<number>,
  benchKg: Array<number>,
  deadliftKg: Array<number>,
  squatStatus: Array<LiftStatus>,
  benchStatus: Array<LiftStatus>,
  deadliftStatus: Array<LiftStatus>
};

export type PlatesOnSide = {
  weightKg: number,
  amount: number
};
