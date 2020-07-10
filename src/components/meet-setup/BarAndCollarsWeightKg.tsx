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

import { setBarAndCollarsWeightKg } from "../../actions/meetSetupActions";
import { getString } from "../../logic/strings";
import { kg2lbs, lbs2kg } from "../../logic/units";

import { Language, Lift, Validation } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";
import { Dispatch } from "redux";
import { SetBarAndCollarsWeightKgAction } from "../../types/actionTypes";
import NumberInput from "../common/NumberInput";

interface OwnProps {
  lift: Lift;
}

interface StateProps {
  inKg: boolean;
  squatBarAndCollarsWeightKg: number;
  benchBarAndCollarsWeightKg: number;
  deadliftBarAndCollarsWeightKg: number;
  language: Language;
}

interface DispatchProps {
  setBarAndCollarsWeightKg: (lift: Lift, weight: number) => SetBarAndCollarsWeightKgAction;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  initialValue: number;
}

class BarAndCollarsWeightKg extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const weight = this.getInitialBarAndCollarsWeightKg(this.props.lift);

    this.state = {
      initialValue: this.props.inKg ? weight : kg2lbs(weight),
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

  validate = (n: number): Validation => {
    // Don't use isInteger() since decimals are allowed.
    if (isNaN(n) || !isFinite(n) || n < 5 || n > 1000) {
      return "error";
    }
    return "success";
  };

  handleChange = (n: number) => {
    if (this.validate(n) === "success") {
      const weight = this.props.inKg ? n : lbs2kg(n);
      this.props.setBarAndCollarsWeightKg(this.props.lift, weight);
    }
  };

  getLiftLabel = (lift: Lift, inKg: boolean, language: Language): string => {
    switch (lift) {
      case "S":
        if (inKg) {
          return getString("meet-setup.bar-weight-squat-kg", language);
        } else {
          return getString("meet-setup.bar-weight-squat-lbs", language);
        }
      case "B":
        if (inKg) {
          return getString("meet-setup.bar-weight-bench-kg", language);
        } else {
          return getString("meet-setup.bar-weight-bench-lbs", language);
        }
      case "D":
        if (inKg) {
          return getString("meet-setup.bar-weight-deadlift-kg", language);
        } else {
          return getString("meet-setup.bar-weight-deadlift-lbs", language);
        }
      default:
        checkExhausted(lift);
        return "";
    }
  };

  render() {
    return (
      <NumberInput
        initialValue={this.state.initialValue}
        step={2.5}
        validate={this.validate}
        onChange={this.handleChange}
        label={this.getLiftLabel(this.props.lift, this.props.inKg, this.props.language)}
      />
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  squatBarAndCollarsWeightKg: state.meet.squatBarAndCollarsWeightKg,
  benchBarAndCollarsWeightKg: state.meet.benchBarAndCollarsWeightKg,
  deadliftBarAndCollarsWeightKg: state.meet.deadliftBarAndCollarsWeightKg,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setBarAndCollarsWeightKg: (lift: Lift, weightKg: number) => dispatch(setBarAndCollarsWeightKg(lift, weightKg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarAndCollarsWeightKg);
