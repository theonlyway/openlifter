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

import { getAllRankings, PointsCategoryResults, sortPointsCategoryResults } from "./pointsPlace";
import { Entry, Equipment, Event, LiftStatus, Sex } from "../types/dataTypes";
import { MAX_ATTEMPTS, newDefaultEntry } from "./entry";

const categoryFactory = (sex: Sex, event: Event, equipment: Equipment): PointsCategoryResults => {
  return {
    category: { sex, event, equipment, isNovice: false },
    orderedEntries: [],
  };
};

describe("getAllRankings", () => {
  const entryFactory = (equipment: Equipment, total: number, bodyweightKg: number, age: number): Entry => {
    const squatKg = Array<number>(MAX_ATTEMPTS).fill(0);
    squatKg[2] = total;

    const squatStatus = Array<LiftStatus>(MAX_ATTEMPTS).fill(-1);
    squatStatus[2] = 1;
    return {
      ...newDefaultEntry(1),
      events: ["S"],
      equipment,
      bodyweightKg,
      squatKg,
      squatStatus,
      age,
    };
  };

  const entries = [
    entryFactory("Sleeves", 0, 100, 25),
    entryFactory("Sleeves", 300, 100, 25),
    entryFactory("Sleeves", 300, 99, 25),
    entryFactory("Sleeves", 298, 80, 25),
    entryFactory("Sleeves", 299, 100, 15),
    entryFactory("Sleeves", 305, 100, 25),
    entryFactory("Wraps", 301, 100, 25),
  ];

  it("get sleeves only total rankings", () => {
    const rankings = getAllRankings(entries, "Total", "None", false, true, "2019-01-01");
    expect(rankings).toEqual([
      {
        ...categoryFactory("M", "S", "Sleeves"),
        orderedEntries: [
          entryFactory("Sleeves", 305, 100, 25),
          entryFactory("Sleeves", 300, 99, 25),
          entryFactory("Sleeves", 300, 100, 25),
          entryFactory("Sleeves", 299, 100, 15),
          entryFactory("Sleeves", 298, 80, 25),
          entryFactory("Sleeves", 0, 100, 25),
        ],
      },
      {
        ...categoryFactory("M", "S", "Wraps"),
        orderedEntries: [entryFactory("Wraps", 301, 100, 25)],
      },
    ]);
  });

  it("get combined sleeves & wraps total rankings", () => {
    const rankings = getAllRankings(entries, "Total", "None", true, true, "2019-01-01");
    expect(rankings).toEqual([
      {
        ...categoryFactory("M", "S", "Wraps"),
        orderedEntries: [
          entryFactory("Sleeves", 305, 100, 25),
          entryFactory("Wraps", 301, 100, 25),
          entryFactory("Sleeves", 300, 99, 25),
          entryFactory("Sleeves", 300, 100, 25),
          entryFactory("Sleeves", 299, 100, 15),
          entryFactory("Sleeves", 298, 80, 25),
          entryFactory("Sleeves", 0, 100, 25),
        ],
      },
    ]);
  });

  it("get FosterMcCulloch total rankings", () => {
    const rankings = getAllRankings(entries, "Total", "FosterMcCulloch", false, true, "2019-01-01");
    expect(rankings).toEqual([
      {
        ...categoryFactory("M", "S", "Sleeves"),
        orderedEntries: [
          entryFactory("Sleeves", 299, 100, 15),
          entryFactory("Sleeves", 305, 100, 25),
          entryFactory("Sleeves", 300, 99, 25),
          entryFactory("Sleeves", 300, 100, 25),
          entryFactory("Sleeves", 298, 80, 25),
          entryFactory("Sleeves", 0, 100, 25),
        ],
      },
      {
        ...categoryFactory("M", "S", "Wraps"),
        orderedEntries: [entryFactory("Wraps", 301, 100, 25)],
      },
    ]);
  });

  it("get wilks rankings", () => {
    const rankings = getAllRankings(entries, "Wilks", "None", false, true, "2019-01-01");
    expect(rankings).toEqual([
      {
        ...categoryFactory("M", "S", "Sleeves"),
        orderedEntries: [
          entryFactory("Sleeves", 298, 80, 25),
          entryFactory("Sleeves", 305, 100, 25),
          entryFactory("Sleeves", 300, 99, 25),
          entryFactory("Sleeves", 300, 100, 25),
          entryFactory("Sleeves", 299, 100, 15),
          entryFactory("Sleeves", 0, 100, 25),
        ],
      },
      {
        ...categoryFactory("M", "S", "Wraps"),
        orderedEntries: [entryFactory("Wraps", 301, 100, 25)],
      },
    ]);
  });
});

describe("sortPointsCategoryResults", () => {
  it("sorts result categories", () => {
    const results = [
      categoryFactory("M", "SBD", "Bare"),
      categoryFactory("F", "BD", "Bare"),
      categoryFactory("F", "SBD", "Sleeves"),
      categoryFactory("F", "SBD", "Bare"),
    ];

    sortPointsCategoryResults(results);

    expect(results).toEqual([
      categoryFactory("F", "SBD", "Bare"),
      categoryFactory("F", "SBD", "Sleeves"),
      categoryFactory("F", "BD", "Bare"),
      categoryFactory("M", "SBD", "Bare"),
    ]);
  });
});
