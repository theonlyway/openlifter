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

import React from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";

import { setLengthDays } from "../../actions/meetSetupActions";

import { GlobalState } from "../../types/stateTypes";
import { FormControlTypeHack, isString } from "../../types/utils";
import { isNumber } from "util";
import { Dispatch } from "redux";

interface StateProps {
  lengthDays: number;
}

interface DispatchProps {
  setLengthDays: (days: number) => any;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  value: number | string;
}

class MeetLength extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: this.props.lengthDays
    };
  }

  getValidationState = () => {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber <= 0 || asNumber > 14) {
      return "error";
    }
    return "success";
  };

  handleChange = (event: React.FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (!isNumber(value) && !isString(value)) {
      throw new Error(`Expected either a number or string, but got "${value}"`);
    }

    this.setState({ value: value }, () => {
      // As callback, save successful value into Redux store.
      if (this.getValidationState() !== "error") {
        this.props.setLengthDays(Number(value));
      }
    });
  };

  render() {
    return (
      // TODO: Validation state styling
      <FormGroup>
        <Form.Label>Days of Lifting</Form.Label>
        <FormControl type="number" min="1" step="1" value={this.state.value.toString()} onChange={this.handleChange} />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  lengthDays: state.meet.lengthDays
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setLengthDays: days => dispatch(setLengthDays(days))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetLength);
