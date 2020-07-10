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

// Color codes must be in upper-case to match the ColorPicker output.
export const PlateColors = {
  PLATE_DEFAULT_BLACK: "#000000",
  PLATE_DEFAULT_WHITE: "#FFFFFF",
  PLATE_DEFAULT_BLUE: "#4990E2",
  PLATE_DEFAULT_GREEN: "#2AB003",
  PLATE_DEFAULT_GRAY: "#575757",
  PLATE_DEFAULT_RED: "#FF0000",
  PLATE_DEFAULT_YELLOW: "#FFEF2A",
  PLATE_DEFAULT_ORANGE: "#F25A1D",
  PLATE_DEFAULT_PINK: "#E81FA5",
  PLATE_DEFAULT_PURPLE: "#9B16F2",
};

export type PlateColorsType = keyof typeof PlateColors;
