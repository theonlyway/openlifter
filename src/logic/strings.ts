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

// Gets translation strings directly given the current language, without
// having to thread the IntlContext everywhere.
//
// This works because we store the language in the Redux store in addition
// to in the React context.

import translations from "../translations";
import { Equipment, Event, Flight, Language, Sex, TranslationId } from "../types/dataTypes";
import { checkExhausted } from "../types/utils";

// Fetches a simple string from the translations store. No formatting is performed.
export const getString = (id: TranslationId, lang: Language): string => {
  return translations[lang][id];
};

// Localizes an Equipment value.
export const localizeEquipment = (equipment: Equipment, language: Language): string => {
  switch (equipment) {
    case "Bare":
      return getString("equipment.bare", language);
    case "Sleeves":
      return getString("equipment.sleeves", language);
    case "Wraps":
      return getString("equipment.wraps", language);
    case "Single-ply":
      return getString("equipment.single-ply", language);
    case "Multi-ply":
      return getString("equipment.multi-ply", language);
    default:
      checkExhausted(equipment);
      return "";
  }
};

// Delocalizes an Equipment value.
export const delocalizeEquipment = (text: string, language: Language): Equipment => {
  if (text === getString("equipment.bare", language)) return "Bare";
  if (text === getString("equipment.sleeves", language)) return "Sleeves";
  if (text === getString("equipment.wraps", language)) return "Wraps";
  if (text === getString("equipment.single-ply", language)) return "Single-ply";
  if (text === getString("equipment.multi-ply", language)) return "Multi-ply";
  throw new Error("Failed to delocalize Equipment: " + text);
};

// Localizes an Event value.
export const localizeEvent = (event: Event, language: Language): string => {
  switch (event) {
    case "S":
      return getString("event.s", language);
    case "B":
      return getString("event.b", language);
    case "D":
      return getString("event.d", language);
    case "SB":
      return getString("event.sb", language);
    case "SD":
      return getString("event.sd", language);
    case "BD":
      return getString("event.bd", language);
    case "SBD":
      return getString("event.sbd", language);
    default:
      checkExhausted(event);
      return "";
  }
};

// Delocalizes an Event value.
export const delocalizeEvent = (text: string, language: Language): Event => {
  if (text === getString("event.s", language)) return "S";
  if (text === getString("event.b", language)) return "B";
  if (text === getString("event.d", language)) return "D";
  if (text === getString("event.sb", language)) return "SB";
  if (text === getString("event.sd", language)) return "SD";
  if (text === getString("event.bd", language)) return "BD";
  if (text === getString("event.sbd", language)) return "SBD";
  throw new Error("Failed to delocalize Event: " + text);
};

// Localizes a Flight value.
export const localizeFlight = (flight: Flight, language: Language): string => {
  return flight;
};

// Delocalizes a Flight value.
export const delocalizeFlight = (text: string, language: Language): Flight => {
  return text as Flight;
};

// Localizes a Sex value.
export const localizeSex = (sex: Sex, language: Language): string => {
  switch (sex) {
    case "M":
      return getString("sex.m", language);
    case "F":
      return getString("sex.f", language);
    case "Mx":
      return getString("sex.mx", language);
    default:
      checkExhausted(sex);
      return "";
  }
};

// Delocalizes a Sex value.
export const delocalizeSex = (text: string, language: Language): string => {
  if (text === getString("sex.m", language)) return "M";
  if (text === getString("sex.f", language)) return "F";
  if (text === getString("sex.mx", language)) return "Mx";
  throw new Error("Failed to delocalize Sex: " + text);
};
