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

import React from "react";
import { connect } from "react-redux";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setBarAndCollarsWeightKg } from "../../actions/meetSetupActions";
import { kg2lbs, lbs2kg } from "../../logic/units";

import type { Lift } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

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
  setBarAndCollarsWeightKg: (Lift, number) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  value: number;
}

class BarAndCollarsWeightKg extends React.Component<Props, InternalState> {
  constructor(props) {
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
        (lift: empty) // eslint-disable-line
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

  handleChange = event => {
    const value = event.target.value;
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
        (lift: empty) // eslint-disable-line
        return "";
    }
  };

  render() {
    const label =
      this.getLiftLabel(this.props.lift) + " Bar + Collars weight (" + (this.props.inKg ? "kg" : "lbs") + ")";

    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl type="number" value={this.state.value} onChange={this.handleChange} step={2.5} />
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

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setBarAndCollarsWeightKg: (lift, weightKg) => dispatch(setBarAndCollarsWeightKg(lift, weightKg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarAndCollarsWeightKg);
