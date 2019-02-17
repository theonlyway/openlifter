// vim: set ts=2 sts=2 sw=2 et:
// @flow
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
import { FormControl, FormGroup } from "react-bootstrap";

import type { Validation } from "../types/dataTypes";

interface OwnProps {
  initialValue: string;
  placeholder: string;
  getValidationState: (value: ?string) => Validation;
  onSuccess: (value: string) => any;
}

type Props = OwnProps;

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

  handleKeyDown = (event: Object) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  handleChange = (event: Object) => {
    this.setState({ value: event.target.value });
  };

  handleBlur = (event: Object) => {
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
      <FormGroup validationState={this.getValidationState()} style={{ marginBottom: 0 }}>
        <FormControl
          type="text"
          placeholder={this.props.placeholder}
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
