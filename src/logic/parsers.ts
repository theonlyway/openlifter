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

// Defines logic for parsing strings into OpenLifter datatypes.
// The strings can come from the user and are therefore untrusted.

import { Equipment, Event, Sex } from "../types/dataTypes";

// Strictly parse a string to an integer. Negatives are allowed.
export const parseInteger = (s: string): number | undefined => {
  // Characters will be compared to ASCII charcodes.
  const ascii_0 = 0x30;
  const ascii_9 = 0x39;
  const ascii_minus = 0x2d;

  // Disallow the empty string.
  if (s.length === 0) {
    return;
  }

  // Check the string character-by-character.
  for (let i = 0; i < s.length; ++i) {
    const charcode = s.charCodeAt(i);

    // A single negative is allowed at the front.
    if (i === 0 && charcode === ascii_minus) {
      continue;
    } else if (charcode < ascii_0 || charcode > ascii_9) {
      return;
    }
  }

  return parseInt(s, 10);
};

// Loosely parse a string to a Sex.
export const parseSex = (s: string): Sex | undefined => {
  const lower = s.toLowerCase();
  if (lower === "m") return "M";
  if (lower === "f") return "F";
  if (lower === "mx") return "Mx";
  return;
};

// Loosely parse a string to an Equipment.
export const parseEquipment = (s: string): Equipment | undefined => {
  const lower = s.toLowerCase();
  if (lower === "bare") return "Bare";
  if (lower === "sleeves") return "Sleeves";
  if (lower === "wraps") return "Wraps";
  if (lower === "unlimited") return "Unlimited";

  // Be more forgiving on these ones: nobody remembers the dash.
  if (lower.startsWith("single")) return "Single-ply";
  if (lower.startsWith("multi")) return "Multi-ply";
  return;
};

// Parse a string to an Event.
// Valid characters are "SBD", which must occur in that order.
export const parseEvent = (s: string): Event | undefined => {
  if (s === "") {
    return;
  }

  // Allow lowercase variants like "sbd".
  const lower = s.toLowerCase();
  const has_squat = lower.includes("s");
  const has_bench = lower.includes("b");
  const has_deadlift = lower.includes("d");

  let acc = "";
  if (has_squat) acc += "S";
  if (has_bench) acc += "B";
  if (has_deadlift) acc += "D";

  // Having reconstructed the string in the right order, check whether it matches.
  if (acc !== s) {
    return;
  }

  return s as Event;
};

// Strictly parse a YYYY-MM-DD date.
export const parseDate = (s: string): string | undefined => {
  // Allow a prepended single-quote, inserted for purposes of preventing
  // Excel auto-localization.
  s = s.replace("'", "");

  // "YYYY-MM-DD".length === 10.
  if (s.length !== 10) {
    return;
  }

  const pieces = s.split("-");
  if (pieces.length !== 3) {
    return;
  }

  if (pieces[0].length !== 4 || pieces[1].length !== 2 || pieces[2].length !== 2) {
    return;
  }

  const year = parseInteger(pieces[0]);
  const month = parseInteger(pieces[1]);
  const day = parseInteger(pieces[2]);

  if (typeof year !== "number" || year < 1920) return;
  if (typeof month !== "number" || month < 1 || month > 12) return;
  if (typeof day !== "number" || day < 1 || day > 31) return;

  return s;
};
