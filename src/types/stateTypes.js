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

// Defines all the project-wide shared Redux state types in a single place.
//
// Because the Redux store is immutable, all types are internally prefixed
// with the "+" covariant type, which makes them immutable.

import type { Entry, Formula, Lift, PlatePairCount } from "./dataTypes";

export type VersionsState = {
  +stateVersion: string,
  +releaseVersion: string
};

export type LanguageState = string;

export type MeetState = {
  +name: string,
  +formula: Formula,
  +federation: string,
  +date: string,
  +lengthDays: number,
  +platformsOnDays: Array<number>,
  +divisions: Array<string>,
  +weightClassesKgMen: Array<number>,
  +weightClassesKgWomen: Array<number>,
  +weightClassesKgMx: Array<number>,
  +inKg: boolean,
  +areWrapsRaw: boolean,
  +country: string,
  +state: string,
  +city: string,
  +barAndCollarsWeightKg: number,
  +platePairCounts: Array<PlatePairCount>
};

export type RegistrationState = {
  +nextEntryId: number,
  +entries: Array<Entry>,
  +lookup: {
    +[id: number]: number
  }
};

export type LiftingState = {
  +day: number,
  +platform: number,
  +flight: string,
  +lift: Lift,
  +overrideAttempt: number | null,
  +overrideEntryId: number | null
};

export type GlobalState = {
  +language: LanguageState,
  +meet: MeetState,
  +registration: RegistrationState,
  +lifting: LiftingState
};
