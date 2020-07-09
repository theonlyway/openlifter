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
import { displayWeight } from "./units";

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
    case "Unlimited":
      return getString("equipment.unlimited", language);
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
  if (text === getString("equipment.unlimited", language)) return "Unlimited";
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
  switch (flight) {
    case "A":
      return getString("flight.a", language);
    case "B":
      return getString("flight.b", language);
    case "C":
      return getString("flight.c", language);
    case "D":
      return getString("flight.d", language);
    case "E":
      return getString("flight.e", language);
    case "F":
      return getString("flight.f", language);
    case "G":
      return getString("flight.g", language);
    case "H":
      return getString("flight.h", language);
    case "I":
      return getString("flight.i", language);
    case "J":
      return getString("flight.j", language);
    case "K":
      return getString("flight.k", language);
    case "L":
      return getString("flight.l", language);
    case "M":
      return getString("flight.m", language);
    case "N":
      return getString("flight.n", language);
    case "O":
      return getString("flight.o", language);
    case "P":
      return getString("flight.p", language);
    default:
      checkExhausted(flight);
      return "";
  }
};

// Delocalizes a Flight value.
export const delocalizeFlight = (text: string, language: Language): Flight => {
  // The "A" character gets special handling for the benefit of Cyrillic.
  // Latin "A" and Cyrillic "A" are visually identical, but differ in encoding.
  if (text === getString("flight.a", language) || text === "A") return "A";

  if (text === getString("flight.b", language)) return "B";
  if (text === getString("flight.c", language)) return "C";
  if (text === getString("flight.d", language)) return "D";
  if (text === getString("flight.e", language)) return "E";
  if (text === getString("flight.f", language)) return "F";
  if (text === getString("flight.g", language)) return "G";
  if (text === getString("flight.h", language)) return "H";
  if (text === getString("flight.i", language)) return "I";
  if (text === getString("flight.j", language)) return "J";
  if (text === getString("flight.k", language)) return "K";
  if (text === getString("flight.l", language)) return "L";
  if (text === getString("flight.m", language)) return "M";
  if (text === getString("flight.n", language)) return "N";
  if (text === getString("flight.o", language)) return "O";
  if (text === getString("flight.p", language)) return "P";
  throw new Error("Failed to delocalize Flight: " + text);
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
export const delocalizeSex = (text: string, language: Language): Sex => {
  if (text === getString("sex.m", language)) return "M";
  if (text === getString("sex.f", language)) return "F";
  if (text === getString("sex.mx", language)) return "Mx";
  throw new Error("Failed to delocalize Sex: " + text);
};

// Localizes a Category weightclass string.
// This is used by the Flight Order and Results pages.
export const localizeWeightClassStr = (wtcls: string, language: Language): string => {
  const isSHW = wtcls.endsWith("+");
  const asNumber = Number(wtcls.replace("+", ""));
  if (asNumber === 0) return "";
  return displayWeight(asNumber, language) + (isSHW ? "+" : "");
};

// Negotiates the default language with the navigator, if possible.
export const getDefaultLanguage = (): Language => {
  const defaultLanguage: Language = "en";

  // Make sure that we're in a modern browser.
  if (typeof navigator !== "object" || typeof navigator.languages !== "object") {
    return defaultLanguage;
  }

  // Iterate over the available languages looking for the first match.
  const languages: ReadonlyArray<string> = navigator.languages;
  for (let i = 0; i < languages.length; ++i) {
    const language = languages[i];
    if (language in translations) {
      return language as Language;
    }
  }

  return defaultLanguage;
};
