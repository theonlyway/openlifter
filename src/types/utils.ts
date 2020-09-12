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

// Defines all the project-wide shared Redux state types in a single place.
//
// Because the Redux store is immutable, all types are internally prefixed
// with the "readonly " covariant type, which makes them immutable.

import { FormControl, FormControlProps } from "react-bootstrap";
import { AgeCoefficients, Flight, Formula, Lift, Sex, Equipment, Event, RecordLift, RecordType } from "./dataTypes";

// This is purely used by the type system to raise a compile error when
// we are trying to perform an exhaustive check (eg in a switch).
// This allows us to have a compile time error, but also have graceful runtime fallback.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function checkExhausted(value: never): void {}

// A workaround for bad typing of react-bootstrap. Open to better suggestions.
// see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16208 for more context
export type FormControlTypeHack = FormControlProps & FormControl & HTMLOrSVGElement;

// Convenience function to narrow a variables type down to a string
export function isString(value: any): value is string {
  return typeof value === "string";
}

// Throws an error if value isn't a string, narrows the type if it is.
export function assertString(value: any): value is string {
  const result = isString(value);
  if (!result) {
    throw new Error(`Expected a string, but got ${value}`);
  }
  return result;
}

// Throws an error if value isn't a number, narrows the type if it is.
export function assertNumber(value: any): value is number {
  const result = typeof value === "number";
  if (!result) {
    throw new Error(`Expected a number, but got ${value}`);
  }
  return result;
}

// Useful for checking for undefined & convincing the compiler that it can safely narrow the type
export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

// Throws an error if value isn't a a valid flight, narrows the type if it is.
export function assertFlight(value: string): value is Flight {
  const flight: Flight = value as Flight;
  switch (flight) {
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "H":
    case "I":
    case "J":
    case "K":
    case "L":
    case "M":
    case "N":
    case "O":
    case "P":
      return true;
    default:
      checkExhausted(flight);
      throw new Error(`Expected a string which corresponds to a Flight, got "${value}"`);
  }
}

// Throws an error if value isn't a a valid flight, narrows the type if it is.
export function assertSex(value: string): value is Sex {
  const sex = value as Sex;
  switch (sex) {
    case "M":
    case "F":
    case "Mx":
      return true;
    default:
      checkExhausted(sex);
      throw new Error(`Expected a string which corresponds to a Sex, got "${value}"`);
  }
}

export function assertLift(value: string): value is Lift {
  const lift = value as Lift;
  switch (lift) {
    case "S":
    case "B":
    case "D":
      return true;
    default:
      checkExhausted(lift);
      throw new Error(`Expected a string which corresponds to a Lift, got "${value}"`);
  }
}

export function assertAgeCoefficients(value: string): value is AgeCoefficients {
  const coefficient = value as AgeCoefficients;
  switch (coefficient) {
    case "FosterMcCulloch":
    case "None":
      return true;
    default:
      checkExhausted(coefficient);
      throw new Error(`Expected a string which corresponds to a valid AgeCoefficients, got "${value}"`);
  }
}

export function assertEvent(value: string): value is Event {
  const event = value as Event;
  switch (event) {
    case "S":
    case "B":
    case "D":
    case "SB":
    case "SD":
    case "BD":
    case "SBD":
      return true;
    default:
      checkExhausted(event);
      throw new Error(`Expected a string which corresponds to a valid Event, got "${value}"`);
  }
}

export function assertRecordType(value: string): value is RecordType {
  const recordType = value as RecordType;
  switch (recordType) {
    case "FullPower":
    case "SingleLift":
      return true;
    default:
      checkExhausted(recordType);
      throw new Error(`Expected a string which corresponds to a valid RecordType, got "${value}"`);
  }
}

export function assertRecordLift(value: string): value is RecordLift {
  const recordLift = value as RecordLift;
  switch (recordLift) {
    case "S":
    case "B":
    case "D":
    case "Total":
      return true;
    default:
      checkExhausted(recordLift);
      throw new Error(`Expected a string which corresponds to a valid RecordLift, got "${value}"`);
  }
}

export function assertEquipment(value: string): value is Equipment {
  const equipment = value as Equipment;
  switch (equipment) {
    case "Bare":
    case "Sleeves":
    case "Wraps":
    case "Single-ply":
    case "Multi-ply":
    case "Unlimited":
      return true;
    default:
      checkExhausted(equipment);
      throw new Error(`Expected a string which corresponds to a valid Equipment, got "${value}"`);
  }
}

export function assertFormula(value: string): value is Formula {
  const formula = value as Formula;
  switch (formula) {
    case "AH":
    case "Bodyweight Multiple":
    case "Dots":
    case "Glossbrenner":
    case "IPF GL Points":
    case "IPF Points":
    case "NASA Points":
    case "Reshel":
    case "Schwartz/Malone":
    case "Total":
    case "Wilks":
    case "Wilks2020":
      return true;
    default:
      checkExhausted(formula);
      throw new Error(`Expected a string which corresponds to a Formula, got "${value}"`);
  }
}
