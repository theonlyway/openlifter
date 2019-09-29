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
import { Language, TranslationId } from "../types/dataTypes";

// Fetches a simple string from the translations store. No formatting is performed.
export const getString = (id: TranslationId, lang: Language): string => {
  return translations[lang][id];
};