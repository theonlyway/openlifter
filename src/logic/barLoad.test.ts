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

import { selectPlates, makeLoadingRelative } from "./barLoad";
import { PlateColors } from "../constants/plateColors";

import { LoadedPlate, Plate } from "../types/dataTypes";

const typicalPlatesKg: Array<Plate> = [
  { weightKg: 25, pairCount: 8, color: PlateColors.PLATE_DEFAULT_RED },
  { weightKg: 20, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
  { weightKg: 15, pairCount: 1, color: PlateColors.PLATE_DEFAULT_YELLOW },
  { weightKg: 10, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 2.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 1.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLACK },
  { weightKg: 0.5, pairCount: 1, color: PlateColors.PLATE_DEFAULT_GREEN },
  { weightKg: 0.25, pairCount: 1, color: PlateColors.PLATE_DEFAULT_BLUE },
];

// Helper function: Converts Array<LoadedPlate> to Array<LoadedPlate.weightAny>.
const asWeights = (plates: Array<LoadedPlate>): Array<number> => {
  return plates.map((x) => x.weightAny);
};

// Helper function: Converts Array<LoadedPlate> to Array<LoadedPlate.isAlreadyLoaded>.
const asIsAlreadyLoaded = (plates: Array<LoadedPlate>): Array<boolean> => {
  return plates.map((x) => x.isAlreadyLoaded);
};

const IS_KG = true;

// Tests for selectPlates().
describe("selectPlates", () => {
  it("returns error as a negative LoadedPlate", () => {
    const plates = selectPlates(500, 0, [], IS_KG);
    expect(plates).toHaveLength(1);
    expect(plates[0].weightAny).toBeLessThan(0);
  });

  it("loads the empty bar (plus collars) correctly", () => {
    const plates = selectPlates(25, 25, typicalPlatesKg, IS_KG);
    expect(plates).toHaveLength(0);
  });

  it("loads 172.5kg correctly", () => {
    const plates = selectPlates(172.5, 25, typicalPlatesKg, IS_KG);
    expect(asWeights(plates)).toEqual([25, 25, 20, 2.5, 1.25]);
  });

  it("loads 205kg correctly", () => {
    const plates = selectPlates(205, 25, typicalPlatesKg, IS_KG);
    expect(asWeights(plates)).toEqual([25, 25, 25, 15]);
  });
});

// Tests for makeLoadingRelative().
describe("makeLoadingRelative", () => {
  it("marks already-loaded 25s correctly", () => {
    const current = selectPlates(175, 25, typicalPlatesKg, IS_KG);
    expect(asWeights(current)).toEqual([25, 25, 25]);
    expect(asIsAlreadyLoaded(current)).toEqual([false, false, false]);

    const next = selectPlates(225, 25, typicalPlatesKg, IS_KG);
    expect(asWeights(next)).toEqual([25, 25, 25, 25]);
    expect(asIsAlreadyLoaded(next)).toEqual([false, false, false, false]);

    makeLoadingRelative(next, current);
    expect(asIsAlreadyLoaded(next)).toEqual([true, true, true, false]);
  });
});
