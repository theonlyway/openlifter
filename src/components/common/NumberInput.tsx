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
//
// This is a generic number input with a minus and a plus surrounding it

import React, { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormControlTypeHack } from "../../types/utils";
import { Validation } from "../../types/dataTypes";

interface Props {
  label?: JSX.Element | string;
  min?: number;
  max?: number;
  step: number;
  value: string;
  onChange: (value: string | undefined) => void;
  validationStatus?: Validation;
  inputWidth?: string;
}

const incrementByStep = (
  baseValue: number,
  step: number,
  max: number | undefined,
  onChange: (value: string | undefined) => void
) => {
  const newValue = baseValue + step;
  if (max !== undefined && newValue > max) {
    onChange(String(max));
  } else {
    onChange(String(newValue));
  }
};

const decrementByStep = (
  baseValue: number,
  step: number,
  min: number | undefined,
  onChange: (value: string | undefined) => void
) => {
  const newValue = baseValue - step;
  if (min !== undefined && newValue < min) {
    onChange(String(min));
  } else {
    onChange(String(newValue));
  }
};

const NumberInput: FunctionComponent<Props> = props => {
  return (
    <Form.Group>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <div style={{ display: "flex" }}>
        <Button
          variant="outline-secondary"
          onClick={() => decrementByStep(Number(props.value), props.step, props.min, props.onChange)}
        >
          -
        </Button>
        <Form.Control
          style={{ width: `${props.inputWidth || "100%"}` }}
          min={props.min}
          max={props.max}
          value={props.value}
          onChange={(event: React.FormEvent<FormControlTypeHack>) => props.onChange(event.currentTarget.value)}
          isValid={props.validationStatus === "success"}
          isInvalid={props.validationStatus === "error"}
          className={props.validationStatus === "warning" ? "is-warning" : undefined}
        />
        <Button
          variant="outline-secondary"
          onClick={() => incrementByStep(Number(props.value), props.step, props.max, props.onChange)}
        >
          +
        </Button>
      </div>
    </Form.Group>
  );
};

export default NumberInput;
