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

// This defines a widget for manually adjusting the width of a column
// in the LiftingTable. The width information is stored in the LiftingState.
//
// The value is stored in the LiftingState in pixels, but is presented
// here as (pixels / 9) to make it look nicer. 9 is used because most columns
// are set to 72px, which is divisible by 9.

import React from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";

import { setTableInfo } from "../../actions/liftingActions";

import { GlobalState, LiftingState } from "../../types/stateTypes";
import { FormControlTypeHack, isString } from "../../types/utils";
import { Dispatch } from "redux";
import { isNumber } from "util";

type WidthFields = "columnDivisionWidthPx";

interface OwnProps {
  label: string; // The label to display.
  fieldName: WidthFields; // Field on the LiftingState to change.
}

interface StateProps {
  lifting: LiftingState;
}

interface DispatchProps {
  setTableInfo: (changes: Partial<LiftingState>) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  value: number | string;
}

// To show smaller numbers, the actual pixel count is divided by this.
const MULTIPLE: number = 9;

class ColumnWidth extends React.Component<Props, InternalState> {
  constructor(props: Props) {
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

  handleChange = (event: React.FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (!isNumber(value) && !isString(value)) {
      throw new Error(`Expected either a number or a string, but got "${value}"`);
    }

    this.setState({ value: value }, () => {
      // As callback, save successful value into Redux store.
      if (this.getValidationState() !== "error") {
        // TODO: figure out how to type this nicely. For now, use any
        let changes: any = {};
        changes[this.props.fieldName] = Math.floor(Number(value) * MULTIPLE);
        this.props.setTableInfo(changes);
      }
    });
  };

  render() {
    return (
      // TODO: Validation state styling
      <FormGroup>
        <Form.Label>{this.props.label}</Form.Label>
        <FormControl
          type="number"
          pattern="[0-9]+"
          min="0"
          step="1"
          value={this.state.value.toString()}
          onChange={this.handleChange}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  lifting: state.lifting
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setTableInfo: (changes: Partial<LiftingState>) => dispatch(setTableInfo(changes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnWidth);
