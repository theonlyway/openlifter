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

import React, { FormEvent } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";

import { setBarAndCollarsWeightKg } from "../../actions/meetSetupActions";
import { kg2lbs, lbs2kg } from "../../logic/units";

import { Lift } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted, FormControlTypeHack } from "../../types/utils";
import { Dispatch } from "redux";
import { SetBarAndCollarsWeightKgAction } from "../../types/actionTypes";

interface OwnProps {
  lift: Lift;
}

interface StateProps {
  inKg: boolean;
  squatBarAndCollarsWeightKg: number;
  benchBarAndCollarsWeightKg: number;
  deadliftBarAndCollarsWeightKg: number;
}

interface DispatchProps {
  setBarAndCollarsWeightKg: (lift: Lift, weight: number) => SetBarAndCollarsWeightKgAction;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  value: number;
}

class BarAndCollarsWeightKg extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const weight = this.getInitialBarAndCollarsWeightKg(this.props.lift);
    const value = this.props.inKg ? weight : kg2lbs(weight);

    this.state = {
      value: value
    };
  }

  getInitialBarAndCollarsWeightKg = (lift: Lift): number => {
    switch (lift) {
      case "S":
        return this.props.squatBarAndCollarsWeightKg;
      case "B":
        return this.props.benchBarAndCollarsWeightKg;
      case "D":
        return this.props.deadliftBarAndCollarsWeightKg;
      default:
        checkExhausted(lift);
        return 0;
    }
  };

  getValidationState = () => {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber <= 0 || asNumber < 5) {
      return "error";
    }
    return "success";
  };

  handleChange = (event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (typeof value !== "number") {
      throw new Error(`Expected a number, but recieved "${value}"`);
    }

    this.setState({ value: value }, () => {
      if (this.getValidationState() === "success") {
        const asNum = Number(value);
        const weight = this.props.inKg ? asNum : lbs2kg(asNum);
        this.props.setBarAndCollarsWeightKg(this.props.lift, weight);
      }
    });
  };

  getLiftLabel = (lift: Lift): string => {
    switch (lift) {
      case "S":
        return "Squat";
      case "B":
        return "Bench";
      case "D":
        return "Deadlift";
      default:
        checkExhausted(lift);
        return "";
    }
  };

  render() {
    const label =
      this.getLiftLabel(this.props.lift) + " Bar + Collars weight (" + (this.props.inKg ? "kg" : "lbs") + ")";

    return (
      // TODO: Form validation styling
      <FormGroup>
        <Form.Label>{label}</Form.Label>
        <FormControl type="number" value={this.state.value.toString()} onChange={this.handleChange} step={2.5} />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  squatBarAndCollarsWeightKg: state.meet.squatBarAndCollarsWeightKg,
  benchBarAndCollarsWeightKg: state.meet.benchBarAndCollarsWeightKg,
  deadliftBarAndCollarsWeightKg: state.meet.deadliftBarAndCollarsWeightKg
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setBarAndCollarsWeightKg: (lift: Lift, weightKg: number) => dispatch(setBarAndCollarsWeightKg(lift, weightKg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarAndCollarsWeightKg);
