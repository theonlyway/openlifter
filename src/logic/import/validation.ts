// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2020 The OpenPowerlifting Project.
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

import { Language, Sex, Equipment, Event, RecordLift, RecordType } from "../../types/dataTypes";
import {
  delocalizeSex,
  getString,
  delocalizeEquipment,
  delocalizeEvent,
  delocalizeRecordLift,
  delocaliseRecordType,
} from "../strings";

export interface ValidationResult<T> {
  errorMessage: string;
  result: T | null;
}

export function validateSex(cell: string, language: Language, errorPrefix: string): ValidationResult<Sex> {
  let result: Sex | null = null;
  let errorMessage: string = "";

  try {
    result = delocalizeSex(cell, language);
  } catch (err) {
    const e = getString("error.csv-field-suffix-sex-invalid", language);
    const m = getString("sex.m", language);
    const f = getString("sex.f", language);
    const mx = getString("sex.mx", language);
    errorMessage = errorPrefix + e.replace("{M}", m).replace("{F}", f).replace("{Mx}", mx);
  }

  return {
    errorMessage,
    result,
  };
}

export function validateEquipment(cell: string, language: Language, errorPrefix: string): ValidationResult<Equipment> {
  let result: Equipment | null = null;
  let errorMessage: string = "";

  try {
    result = delocalizeEquipment(cell, language);
  } catch (err) {
    const e = getString("error.csv-field-suffix-equipment-invalid", language);
    const bare = getString("equipment.bare", language);
    const sleeves = getString("equipment.sleeves", language);
    const wraps = getString("equipment.wraps", language);
    const single = getString("equipment.single-ply", language);
    const multi = getString("equipment.multi-ply", language);

    errorMessage =
      errorPrefix +
      e
        .replace("{bare}", bare)
        .replace("{sleeves}", sleeves)
        .replace("{wraps}", wraps)
        .replace("{single}", single)
        .replace("{multi}", multi);
  }

  return {
    errorMessage,
    result,
  };
}

export function validateEvent(cell: string, language: Language, errorPrefix: string): ValidationResult<Event> {
  let result: Event | null = null;
  let errorMessage: string = "";

  try {
    result = delocalizeEvent(cell, language);
  } catch (err) {
    const e = getString("error.csv-field-suffix-event-invalid", language);
    const sbd = getString("event.sbd", language);
    const bd = getString("event.bd", language);
    const sb = getString("event.sb", language);
    const sd = getString("event.sd", language);
    const s = getString("event.s", language);
    const b = getString("event.b", language);
    const d = getString("event.d", language);
    errorMessage =
      errorPrefix +
      e
        .replace("{SBD}", sbd)
        .replace("{BD}", bd)
        .replace("{SB}", sb)
        .replace("{SD}", sd)
        .replace("{S}", s)
        .replace("{B}", b)
        .replace("{D}", d);
  }

  return {
    result,
    errorMessage,
  };
}

export function validateRecordLift(
  cell: string,
  language: Language,
  errorPrefix: string
): ValidationResult<RecordLift> {
  let result: RecordLift | null = null;
  let errorMessage: string = "";

  try {
    result = delocalizeRecordLift(cell, language);
  } catch (err) {
    // localise this
    errorMessage = errorPrefix + "record lift parsing failed";
  }

  return {
    result,
    errorMessage,
  };
}

export function validateRecordType(
  cell: string,
  language: Language,
  errorPrefix: string
): ValidationResult<RecordType> {
  let result: RecordType | null = null;
  let errorMessage: string = "";

  try {
    result = delocaliseRecordType(cell, language);
  } catch (err) {
    // localise this
    errorMessage = errorPrefix + "record type parsing failed";
  }

  return {
    result,
    errorMessage,
  };
}
