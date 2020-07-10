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

import { OverwriteStoreAction } from "../types/actionTypes";
import { GlobalState } from "../types/stateTypes";

// Overwrites the entire Redux store, handled separately by each reducer.
// This is used to implement "Load from File" functionality.
export const overwriteStore = (store: GlobalState): OverwriteStoreAction => {
  return {
    type: "OVERWRITE_STORE",
    store: store,
  };
};
