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

import { Validation } from "../types/dataTypes";

// Validates a string date in the ISO8601 "YYYY-MM-DD" format.
export const validateIso8601Date = (s?: string): Validation => {
  if (typeof s !== "string") return "error";

  if (s === "") return null;
  if (s.length !== "YYYY-MM-DD".length) return "error";

  const pieces: Array<string> = s.split("-");
  if (pieces.length !== 3) return "error";

  const [yearStr, monthStr, dayStr] = pieces;

  // Ensure that the strings only contain numbers, because the Number() constructor
  // will ignore whitespace.
  const onlyNumbers = /^[0-9]+$/;

  if (!yearStr.match(onlyNumbers)) return "error";
  if (!monthStr.match(onlyNumbers)) return "error";
  if (!dayStr.match(onlyNumbers)) return "error";

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return "error";
  if (year <= 0 || month <= 0 || month > 12 || day <= 0 || day > 31) return "error";

  // Disallow dates that are out of the plausible range for powerlifting.
  if (year < 1880 || year >= new Date().getFullYear() + 2) return "error";

  return "success";
};
