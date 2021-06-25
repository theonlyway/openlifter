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

// This is a generic number input with a minus and a plus surrounding it.

import React from "react";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { string2number, displayNumber } from "../../logic/units";

import { assertString } from "../../types/utils";
import { Language, Validation } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

interface OwnProps {
  initialValue: number; // Starting value when rendering the widget.

  // Properties related to validation.
  step: number; // Amount with which +/- buttons should increment or decrement.
  validate: (n: number) => Validation; // Verifies that the number is valid.
  onChange: (n: number) => void; // Callback. Only validated numbers are reported.

  // Properties related to display.
  label?: JSX.Element | string; // A label to display on the element.
  marginBottom?: string; // Allows overriding margin (Forms by default have margins).
}

interface StateProps {
  language: Language;
}

type Props = OwnProps & StateProps;

interface InternalState {
  value: string;
}

class NumberInput extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    // Handles manual text entry.
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    // Handles the +/- buttons on the side of the input.
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleStep = this.handleStep.bind(this);

    // Internal state, for purposes of validation.
    // To avoid confusion (auto-rounding) when typing, just store a string.
    this.state = {
      value: displayNumber(props.initialValue, props.language),
    };
  }

  // Used when the user manually types into the input box.
  handleChange = (event: React.BaseSyntheticEvent): void => {
    const value = event.currentTarget.value;
    if (assertString(value)) {
      this.setState({ value: value });
    }
  };

  // Used when the user removes focus from the input box.
  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const num: number = string2number(event.currentTarget.value);
    if (this.props.validate(num) !== "error") {
      this.props.onChange(num);
    }
  };

  handleDecrement = (): void => {
    this.handleStep(this.props.step * -1);
  };

  handleIncrement = (): void => {
    this.handleStep(this.props.step);
  };

  handleStep = (step: number): void => {
    let n: number = string2number(this.state.value) + step;

    // Make sure that the new value is a multiple of the step.
    const multiple = Math.abs(step);
    if (step > 0) {
      n = Math.floor(n / multiple) * multiple;
    } else {
      n = Math.ceil(n / multiple) * multiple;
    }

    if (this.props.validate(n) !== "error") {
      this.setState({ value: displayNumber(n, this.props.language) });
      this.props.onChange(n);
    }
  };

  render() {
    const validation: Validation = this.props.validate(string2number(this.state.value));

    return (
      <Form.Group style={{ marginBottom: `${this.props.marginBottom || undefined}` }}>
        {this.props.label && <Form.Label>{this.props.label}</Form.Label>}
        <InputGroup>
          <InputGroup.Prepend>
            <Button variant="outline-secondary" style={{ borderRight: "0px" }} onMouseDown={this.handleDecrement}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          </InputGroup.Prepend>
          <Form.Control
            value={this.state.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            isValid={validation === "success"}
            isInvalid={validation === "error"}
            className={validation === "warning" ? "is-warning" : undefined}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" style={{ borderLeft: "0px" }} onMouseDown={this.handleIncrement}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(NumberInput);
