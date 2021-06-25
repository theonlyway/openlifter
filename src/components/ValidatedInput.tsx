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

// This defines a generic text input that colors itself based upon a validation
// function passed in OwnProps. On blur, an onSuccess() callback is called
// if validation passes; otherwise, the text input reverts to the initial state.

import React from "react";

import Form from "react-bootstrap/Form";

import { Validation } from "../types/dataTypes";
import { assertString } from "../types/utils";

interface OwnProps {
  type?: string; // The type of input, such as "text" or "number". Defaults to "text".
  label?: string; // Form label text, shown above the input.
  initialValue: string;
  placeholder?: string;
  disabled?: boolean;
  validate: (value?: string) => Validation;
  onSuccess: (value: string) => void;

  // By default, the bottom margin is removed so that this can be used in tables.
  // Setting this to true adds the margin back. Defaults to false.
  keepMargin?: boolean;
}

type Props = Readonly<OwnProps>;

interface InternalState {
  value: string;
}

class BirthDateInput extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: props.initialValue,
    };
  }

  validate = (): Validation => {
    return this.props.validate(this.state.value);
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  handleChange = (event: React.BaseSyntheticEvent) => {
    if (assertString(event.currentTarget.value)) {
      this.setState({ value: event.currentTarget.value });
    }
  };

  handleBlur = () => {
    if (this.validate() === "error") {
      this.setState({ value: this.props.initialValue });
      return;
    }

    if (this.props.initialValue !== this.state.value) {
      this.props.onSuccess(this.state.value);
    }
  };

  render() {
    const validation: Validation = this.validate();
    const maybeLabel = this.props.label ? <Form.Label>{this.props.label}</Form.Label> : undefined;

    return (
      <Form.Group style={this.props.keepMargin === true ? undefined : { marginBottom: 0 }}>
        {maybeLabel}
        <Form.Control
          type={this.props.type ? this.props.type : "text"}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled === true ? true : undefined}
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          isValid={validation === "success"}
          isInvalid={validation === "error"}
          className={validation === "warning" ? "is-warning" : undefined}
        />
      </Form.Group>
    );
  }
}

export default BirthDateInput;
