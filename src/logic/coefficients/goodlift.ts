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

// Defines the calculation of IPF GL (GOODLIFT) Points.

import { Sex, Event, Equipment } from "../../types/dataTypes";

type Coefficients = Array<number>;
type ByEvent = {
  SBD: Coefficients;
  B: Coefficients;
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
      SBD: [1199.72839, 1025.18162, 0.00921],
      B: [320.98041, 281.40258, 0.01008],
    },
    "Single-ply": {
      SBD: [1236.25115, 1449.21864, 0.01644],
      B: [381.22073, 733.79378, 0.02398],
    },
  },
  F: {
    Sleeves: {
      SBD: [610.32796, 1045.59282, 0.03048],
      B: [142.40398, 442.52671, 0.04724],
    },
    "Single-ply": {
      SBD: [758.63878, 949.31382, 0.02435],
      B: [221.82209, 357.00377, 0.02937],
    },
  },
};

export const goodlift = (
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

  if (event !== "SBD" && event !== "B") return 0;
  if (normalizedSex !== "M" && normalizedSex !== "F") return 0;

  const params = PARAMETERS[normalizedSex][normalizedEquipment][event];
  const denom = params[0] - params[1] * Math.exp(-1.0 * params[2] * bodyweightKg);
  const glp = denom === 0 ? 0 : Math.max(0, (totalKg * 100.0) / denom);
  if (isNaN(glp) || bodyweightKg < 35) {
    return 0.0;
  }
  return glp;
};
