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
import { displayWeight, kg2lbs, lbs2kg, string2number } from "../../logic/units";

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
  value: string;
}

class BarAndCollarsWeightKg extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const weight = this.getInitialBarAndCollarsWeightKg(this.props.lift);
    const value = this.props.inKg ? weight : kg2lbs(weight);

    this.state = {
      value: displayWeight(value, props.language)
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

  validate = (): Validation => {
    const asNumber = string2number(this.state.value);
    if (isNaN(asNumber) || asNumber <= 0 || asNumber < 5) {
      return "error";
    }
    return "success";
  };

  handleChange = (value: string | undefined) => {
    const stringValue = value || "";
    this.setState({ value: stringValue }, () => {
      if (this.validate() === "success") {
        const asNum = string2number(stringValue);
        const weight = this.props.inKg ? asNum : lbs2kg(asNum);
        this.props.setBarAndCollarsWeightKg(this.props.lift, weight);
      }
    });
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
    const validation: Validation = this.validate();
    const label = this.getLiftLabel(this.props.lift, this.props.inKg, this.props.language);

    return (
      <NumberInput
        label={label}
        min={0}
        step={2.5}
        value={this.state.value}
        onChange={this.handleChange}
        language={this.props.language}
        validationStatus={validation}
      />
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  squatBarAndCollarsWeightKg: state.meet.squatBarAndCollarsWeightKg,
  benchBarAndCollarsWeightKg: state.meet.benchBarAndCollarsWeightKg,
  deadliftBarAndCollarsWeightKg: state.meet.deadliftBarAndCollarsWeightKg,
  language: state.language
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
