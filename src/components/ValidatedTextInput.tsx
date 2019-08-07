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

import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { Validation } from "../types/dataTypes";
import { FormControlTypeHack, assertString } from "../types/utils";

interface OwnProps {
  initialValue: string;
  placeholder?: string;
  disabled?: boolean;
  getValidationState: (value?: string) => Validation;
  onSuccess: (value: string) => void;
}

type Props = Readonly<OwnProps>;

interface InternalState {
  value: string;
}

class BirthDateInput extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: props.initialValue
    };
  }

  getValidationState = (): Validation => {
    return this.props.getValidationState(this.state.value);
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  handleChange = (event: React.FormEvent<FormControlTypeHack>) => {
    if (assertString(event.currentTarget.value)) {
      this.setState({ value: event.currentTarget.value });
    }
  };

  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (this.getValidationState() === "error") {
      this.setState({ value: this.props.initialValue });
      return;
    }

    if (this.props.initialValue !== this.state.value) {
      this.props.onSuccess(this.state.value);
    }
  };

  render() {
    return (
      <FormGroup
        /* TODO: Validation State styling validationState={this.getValidationState()} */ style={{ marginBottom: 0 }}
      >
        <FormControl
          type="text"
          placeholder={this.props.placeholder}
          disabled={this.props.disabled === true ? true : undefined}
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormGroup>
    );
  }
}

export default BirthDateInput;
