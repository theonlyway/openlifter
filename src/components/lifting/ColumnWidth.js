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

// This defines a widget for manually adjusting the width of a column
// in the LiftingTable. The width information is stored in the LiftingState.
//
// The value is stored in the LiftingState in pixels, but is presented
// here as (pixels / 9) to make it look nicer. 9 is used because most columns
// are set to 72px, which is divisible by 9.

import React from "react";
import { connect } from "react-redux";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setTableInfo } from "../../actions/liftingActions";

import type { GlobalState, LiftingState } from "../../types/stateTypes";

interface OwnProps {
  label: string; // The label to display.
  fieldName: string; // Field on the LiftingState to change.
}

interface StateProps {
  lifting: LiftingState;
}

interface DispatchProps {
  setTableInfo: (changes: $Shape<LiftingState>) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  value: number | string;
}

// To show smaller numbers, the actual pixel count is divided by this.
const MULTIPLE: number = 9;

class ColumnWidth extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: Math.ceil(this.props.lifting[this.props.fieldName] / MULTIPLE)
    };
  }

  getValidationState = () => {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber < 0 || asNumber > 1000) {
      return "error";
    }
    return "success";
  };

  handleChange = event => {
    const value = event.target.value;

    this.setState({ value: value }, () => {
      // As callback, save successful value into Redux store.
      if (this.getValidationState() !== "error") {
        let changes = {};
        changes[this.props.fieldName] = Math.floor(Number(value) * MULTIPLE);
        this.props.setTableInfo(changes);
      }
    });
  };

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl
          type="number"
          pattern="[0-9]+"
          min="0"
          step="1"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  lifting: state.lifting
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setTableInfo: (changes: $Shape<LiftingState>) => dispatch(setTableInfo(changes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnWidth);
