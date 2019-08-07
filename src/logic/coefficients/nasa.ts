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

// Defines the calculation of NASA Points.
// They are defined in a coefficient table: http://nasa-sports.com/coefficient-system/
// It turns out that they are a simple line.

export const nasapoints = (bodyweightKg: number, totalKg: number): number => {
  // The function was determined using fitting in GNUPlot:
  //
  // Final set of parameters            Asymptotic Standard Error
  // =======================            ==========================
  // m               = 0.00620912       +/- 1.265e-06    (0.02037%)
  // b               = 0.565697         +/- 0.0001322    (0.02337%)
  const m = 0.00620912;
  const b = 0.565697;

  if (bodyweightKg < 30) return 0; // Arbitrary lower bound.
  return (totalKg / bodyweightKg) * (m * bodyweightKg + b);
};
