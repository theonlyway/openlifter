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
import { Plate } from "../../types/dataTypes";
import NumberInput from "../common/NumberInput";
import ColorPicker from "./ColorPicker";
import { GlobalState } from "../../types/stateTypes";
import FormGroup from "react-bootstrap/FormGroup";

interface Props {
  id: string;
  weightKg: number;
  displayWeight: string;
  defaultValue: string;
  pairCount: number;
  color: string;
  onChange: (weightKg: number, id: string, amount: number, color: string) => void;
}

const PlateInput: FunctionComponent<Props> = props => {
  return (
    <tr key={props.id}>
      <td>{props.displayWeight}</td>
      <td>
        <FormGroup>
          <NumberInput
            min={0}
            step={1}
            value={String(props.pairCount)}
            onChange={count => props.onChange(props.weightKg, props.id, Number(count), props.color)}
            inputWidth="50%"
          />
        </FormGroup>
      </td>
      <td>
        <ColorPicker
          color={props.color}
          onChange={color => props.onChange(props.weightKg, props.id, props.pairCount, color)}
        />
      </td>
    </tr>
  );
};

export default PlateInput;
