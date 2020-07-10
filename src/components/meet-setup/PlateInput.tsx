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

// Displays the selector for determining how many plates are available
// to loaders on one side, and what color it is, for a single plate weight.

import React, { FunctionComponent } from "react";

import NumberInput from "../common/NumberInput";
import ColorPicker from "./ColorPicker";

import { Validation } from "../../types/dataTypes";

interface Props {
  id: string;
  weightKg: number;
  displayWeight: string; // What kind of a plate this is.
  pairCount: number;
  color: string;
  onChange: (weightKg: number, id: string, amount: number, color: string) => void;
}

const validate = (n: number): Validation => {
  if (!Number.isInteger(n) || n < 0 || n > 50) {
    return "error";
  }
  return "success";
};

const PlateInput: FunctionComponent<Props> = (props) => {
  return (
    <tr key={props.id}>
      <td>{props.displayWeight}</td>
      <td>
        <div style={{ maxWidth: "130px" }}>
          <NumberInput
            initialValue={props.pairCount}
            step={1}
            validate={validate}
            onChange={(count) => props.onChange(props.weightKg, props.id, count, props.color)}
            marginBottom="0px"
          />
        </div>
      </td>
      <td>
        <ColorPicker
          color={props.color}
          onChange={(color) => props.onChange(props.weightKg, props.id, props.pairCount, color)}
        />
      </td>
    </tr>
  );
};

export default PlateInput;
