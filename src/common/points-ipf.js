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

// Defines the calculation of IPF Points.
// Taken from https://gitlab.com/openpowerlifting/ipf-points-calculator.

import type { Sex, Event, Equipment } from "../reducers/registrationReducer";

type Coefficients = Array<number>;
type ByEvent = {
  SBD: Coefficients,
  B: Coefficients
};
type ByEquipment = {
  Raw: ByEvent,
  "Single-ply": ByEvent
};
type BySex = {
  M: ByEquipment,
  F: ByEquipment
};

const PARAMETERS: BySex = {
  M: {
    Raw: {
      SBD: [310.67, 857.785, 53.216, 147.0835],
      B: [86.4745, 259.155, 17.57845, 53.122]
    },
    "Single-ply": {
      SBD: [387.265, 1121.28, 80.6324, 222.4896],
      B: [133.94, 441.465, 35.3938, 113.0057]
    }
  },
  F: {
    Raw: {
      SBD: [125.1435, 228.03, 34.5246, 86.8301],
      B: [25.0485, 43.848, 6.7172, 13.952]
    },
    "Single-ply": {
      SBD: [176.58, 373.315, 48.4534, 110.0103],
      B: [49.106, 124.209, 23.199, 67.4926]
    }
  }
};

export const ipfpoints = (
  totalKg: number,
  bodyweightKg: number,
  sex: Sex,
  equipment: Equipment,
  event: Event
): number => {
  if (totalKg === 0) return 0;

  // Restrict inputs to only the defined subset.
  if (equipment === "Wraps") equipment = "Raw";
  if (equipment === "Multi-ply") equipment = "Single-ply";
  if (equipment !== "Raw" && equipment !== "Single-ply") return 0;
  if (event !== "SBD" && event !== "B") return 0;
  if (sex !== "M" && sex !== "F") return 0;

  const params = PARAMETERS[sex][equipment][event];
  const bw_log = Math.log(bodyweightKg);

  const mean = params[0] * bw_log - params[1];
  const dev = params[2] * bw_log - params[3];

  const points = 500 + (100 * (totalKg - mean)) / dev;
  if (isNaN(points) || points < 0) {
    return 0;
  }
  return points;
};
