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

// Defines the calculation of IPF Points.
// Taken from https://gitlab.com/openpowerlifting/ipf-points-calculator.

import { Sex, Event, Equipment } from "../../types/dataTypes";

type Coefficients = Array<number>;
type ByEvent = {
  SBD: Coefficients;
  S: Coefficients;
  B: Coefficients;
  D: Coefficients;
};
type ByEquipment = {
  Sleeves: ByEvent;
  "Single-ply": ByEvent;
};
type BySex = {
  M: ByEquipment;
  F: ByEquipment;
};

const PARAMETERS: BySex = {
  M: {
    Sleeves: {
      SBD: [310.67, 857.785, 53.216, 147.0835],
      S: [123.1, 363.085, 25.1667, 75.4311],
      B: [86.4745, 259.155, 17.57845, 53.122],
      D: [103.5355, 244.765, 15.3714, 31.5022],
    },
    "Single-ply": {
      SBD: [387.265, 1121.28, 80.6324, 222.4896],
      S: [150.485, 446.445, 36.5155, 103.7061],
      B: [133.94, 441.465, 35.3938, 113.0057],
      D: [110.135, 263.66, 14.996, 23.011],
    },
  },
  F: {
    Sleeves: {
      SBD: [125.1435, 228.03, 34.5246, 86.8301],
      S: [50.479, 105.632, 19.1846, 56.2215],
      B: [25.0485, 43.848, 6.7172, 13.952],
      D: [47.136, 67.349, 9.1555, 13.67],
    },
    "Single-ply": {
      SBD: [176.58, 373.315, 48.4534, 110.0103],
      S: [74.6855, 171.585, 21.9475, 52.2948],
      B: [49.106, 124.209, 23.199, 67.4926],
      D: [51.002, 69.8265, 8.5802, 5.7258],
    },
  },
};

export const ipfpoints = (
  totalKg: number,
  bodyweightKg: number,
  sex: Sex,
  equipment: Equipment,
  event: Event,
): number => {
  if (totalKg === 0) return 0;
  if (bodyweightKg < 40) return 0;

  // Restrict inputs to only the defined subset.
  let normalizedEquipment = equipment;
  if (equipment === "Bare" || equipment === "Wraps") {
    normalizedEquipment = "Sleeves";
  } else if (equipment === "Multi-ply" || equipment === "Unlimited") {
    normalizedEquipment = "Single-ply";
  }
  if (normalizedEquipment !== "Sleeves" && normalizedEquipment !== "Single-ply") {
    return 0;
  }

  // Consider Mx athletes as M, since that's the harsher formula.
  let normalizedSex = sex;
  if (sex === "Mx") normalizedSex = "M";

  if (event !== "SBD" && event !== "S" && event !== "B" && event !== "D") return 0;
  if (normalizedSex !== "M" && normalizedSex !== "F") return 0;

  const params = PARAMETERS[normalizedSex][normalizedEquipment][event];
  const bw_log = Math.log(bodyweightKg);

  const mean = params[0] * bw_log - params[1];
  const dev = params[2] * bw_log - params[3];

  const points = 500 + (100 * (totalKg - mean)) / dev;
  if (isNaN(points) || points < 0) {
    return 0;
  }
  return points;
};
