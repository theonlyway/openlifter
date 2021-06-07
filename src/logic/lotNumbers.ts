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

import { shuffle } from "../components/debug/RandomizeHelpers";
import { Flight } from "../types/dataTypes";

type FlightToEntriesLookup = {
  [flight in Flight]: {
    entry: { flight: Flight };
    index: number;
  }[];
};

export function generateRandomLotNumbersSequencedByFlight(entries: ReadonlyArray<{ flight: Flight }>): number[] {
  // Group lifters up by flight - a list per flight
  const groups = entries.reduce((val, entry, index) => {
    const flight = entry.flight;
    if (!val[flight]) {
      val[flight] = [];
    }
    // Store the lifter + their index in the entries array
    val[flight].push({ entry, index });
    return val;
  }, {} as FlightToEntriesLookup);

  let lotNumber = 0;
  // For every flight, sort by A->Z. Shuffle everyone in the flight, then insert their lot number into the lotnumbers array, indexed by their position in entries
  return Object.keys(groups)
    .sort()
    .reduce((lotNumbers, key) => {
      // Cast because the compiler can't quite work-out that keys() will always return a Flight as a key
      const flight: Flight = key as Flight;
      const entriesInFlight = groups[flight];
      // Shuffle the entries in this flight so that their lot numbers are truly random
      shuffle(entriesInFlight);
      entriesInFlight.forEach((entry) => {
        lotNumber += 1;
        // lotNumbers is indexed by the entries position in the redux entries array, so insert the lot number at that corresponding position
        lotNumbers[entry.index] = lotNumber; // The re
      });

      return lotNumbers;
    }, new Array<number>());
}
