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

import { Flight } from "../types/dataTypes";
import { generateRandomLotNumbersSequencedByFlight } from "./lotNumbers";

const entries: { flight: Flight }[] = [
  {
    flight: "B",
  },
  {
    flight: "B",
  },
  {
    flight: "E",
  },
  {
    flight: "A",
  },
  {
    flight: "O",
  },
  {
    flight: "A",
  },
  {
    flight: "C",
  },
  {
    flight: "C",
  },
  {
    flight: "E",
  },
  {
    flight: "A",
  },
  {
    flight: "D",
  },
  {
    flight: "B",
  },
  {
    flight: "D",
  },
];

it("should not contain duplicate lot numbers", () => {
  const generatedLotNumbers = generateRandomLotNumbersSequencedByFlight(entries);
  const uniqueNumbers = new Set(generatedLotNumbers);
  expect(generatedLotNumbers.length).toEqual(uniqueNumbers.size);
});

it("should start at 1 and finish at N", () => {
  const generatedLotNumbers = generateRandomLotNumbersSequencedByFlight(entries);
  const minLotNumber = Math.min(...generatedLotNumbers);
  const maxLotNumber = Math.max(...generatedLotNumbers);
  expect(minLotNumber).toEqual(1);
  expect(maxLotNumber).toEqual(entries.length);
});

it("should be loosely ordered by flight", () => {
  const generatedLotNumbers = generateRandomLotNumbersSequencedByFlight(entries);
  for (let i = 0; i < entries.length; i++) {
    const flight = entries[i].flight;
    const lotNo = generatedLotNumbers[i];
    for (let j = 0; j < entries.length; j++) {
      const otherFlight = entries[j].flight;
      const otherLotNo = generatedLotNumbers[j];

      // EG: B > A - expect B's lot number to be higher then A
      if (flight > otherFlight) {
        expect(lotNo).toBeGreaterThan(otherLotNo);
      } else if (flight < otherFlight) {
        expect(lotNo).toBeLessThan(otherLotNo);
      }
      // else same flight - nothing to assert
    }
  }
});
