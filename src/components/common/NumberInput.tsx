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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { string2number, displayNumber } from "../../logic/units";

import { FormControlTypeHack } from "../../types/utils";
import { Language, Validation } from "../../types/dataTypes";

interface Props {
  label?: JSX.Element | string;
  min?: number;
  max?: number;
  step: number;
  value: string;
  onChange: (value: string | undefined) => void;
  language: Language;
  validationStatus?: Validation;
  marginBottom?: string;
}

const incrementByStep = (
  baseValue: number,
  step: number,
  max: number | undefined,
  onChange: (value: string | undefined) => void,
  language: Language
) => {
  const newValue: number = baseValue + step;
  if (max !== undefined && newValue > max) {
    onChange(displayNumber(max, language));
  } else {
    console.log(newValue, displayNumber(newValue, language));
    onChange(displayNumber(newValue, language));
  }
};

const decrementByStep = (
  baseValue: number,
  step: number,
  min: number | undefined,
  onChange: (value: string | undefined) => void,
  language: Language
) => {
  const newValue: number = baseValue - step;
  if (min !== undefined && newValue < min) {
    onChange(displayNumber(min, language));
  } else {
    onChange(displayNumber(newValue, language));
  }
};

const NumberInput: FunctionComponent<Props> = props => {
  return (
    <Form.Group style={{ marginBottom: `${props.marginBottom || undefined}` }}>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <InputGroup>
        <InputGroup.Prepend>
          <Button
            variant="outline-secondary"
            onClick={() =>
              decrementByStep(string2number(props.value), props.step, props.min, props.onChange, props.language)
            }
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </InputGroup.Prepend>
        <Form.Control
          min={props.min}
          max={props.max}
          value={props.value}
          onChange={(event: React.FormEvent<FormControlTypeHack>) => props.onChange(event.currentTarget.value)}
          isValid={props.validationStatus === "success"}
          isInvalid={props.validationStatus === "error"}
          className={props.validationStatus === "warning" ? "is-warning" : undefined}
        />
        <InputGroup.Append>
          <Button
            variant="outline-secondary"
            onClick={() =>
              incrementByStep(string2number(props.value), props.step, props.max, props.onChange, props.language)
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
  );
};

export default NumberInput;
