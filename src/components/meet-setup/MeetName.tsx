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

// Defines the MeetName text input box with validation.

import React, { FormEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Form from "react-bootstrap/Form";

import { setMeetName } from "../../actions/meetSetupActions";

import { Validation } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { isString, FormControlTypeHack } from "../../types/utils";

interface StateProps {
  name: string;
}

interface DispatchProps {
  setMeetName: (name: string) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  value: string;
}

class MeetName extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: this.props.name
    };
  }

  validate = (): Validation => {
    const { value } = this.state;
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  handleChange = (event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (isString(value)) {
      this.setState({ value: value });
    }
  };

  // When the control loses focus, possibly update the Redux store.
  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (this.validate() !== "success") {
      return;
    }
    this.props.setMeetName(this.state.value);
  };

  render() {
    const validation = this.validate();

    return (
      <Form.Group>
        <Form.Label>Meet Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Meet Name"
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          isValid={validation === "success"}
          isInvalid={validation === "error"}
        />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  name: state.meet.name
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setMeetName: name => dispatch(setMeetName(name))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetName);
