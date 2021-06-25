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

import { ChangeLanguageAction, OverwriteStoreAction } from "../types/actionTypes";
import { Language } from "../types/dataTypes";
import { checkExhausted } from "../types/utils";

type Action = ChangeLanguageAction | OverwriteStoreAction;

export default function languageReducer(state: Language = "en", action: Action): Language {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      return action.language;

    case "OVERWRITE_STORE":
      return action.store.language;

    default:
      checkExhausted(action);
      return state;
  }
}
