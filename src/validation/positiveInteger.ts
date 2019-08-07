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

// Validates a simple positive integer.
export const validatePositiveInteger = (s?: string, inclusiveMax?: number): Validation => {
  if (typeof s !== "string") return "error";

  if (s === "") return null;

  // Ensure that the string only contains numbers, because the Number() constructor
  // will ignore whitespace.
  const onlyNumbers = /^[0-9]+$/;
  if (!s.match(onlyNumbers)) return "error";

  // The number shouldn't start with an unnecessary zero.
  if (s.startsWith("0")) return "error";

  const n = Number(s);

  // Ensure the number is a positive integer.
  if (isNaN(n)) return "error";
  if (!Number.isInteger(n)) return "error";
  if (n <= 0) return "error";

  // Allow an optional inclusive upper bound check.
  if (typeof inclusiveMax === "number") {
    if (n > inclusiveMax) return "error";
  }

  return "success";
};
