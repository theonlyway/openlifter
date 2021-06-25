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

// See comments in src/versions.js.

import { stateVersion, releaseVersion } from "../versions";
import { OverwriteStoreAction } from "../types/actionTypes";
import { VersionsState } from "../types/stateTypes";

const initialState: VersionsState = {
  stateVersion,
  releaseVersion,
};

type Action = OverwriteStoreAction;

export default function versionReducer(state: VersionsState = initialState, action: Action): VersionsState {
  switch (action.type) {
    case "OVERWRITE_STORE":
      return action.store.versions;

    default:
      return state;
  }
}
