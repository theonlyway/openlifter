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

// Defines an input of a single weight, during configuration.
// Since it's for configuration, it doesn't have an associated success/failure value.
//
// For consistency purposes, weights are always stored in kg.

import React from "react";
import { connect } from "react-redux";
import { FormControl, FormGroup } from "react-bootstrap";

import { updateRegistration } from "../../actions/registrationActions";
import { enterAttempt } from "../../actions/liftingActions";

import { liftToAttemptFieldName } from "../../logic/entry";
import { kg2lbs, lbs2kg, displayWeight } from "../../logic/units";

import type { Entry, Lift } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

interface OwnProps {
  id: number; // The EntryID.
  field: string;
  disabled: boolean;

  // Optional attributes used only for lifts (as opposed to for bodyweights).
  placeholder?: ?string;
  lift?: Lift;
  attemptOneIndexed?: number;
  multipleOf?: number;
}

interface StateProps {
  inKg: boolean;
  weightKg: number;
}

interface DispatchProps {
  updateRegistration: (entryId: number, obj: $Shape<Entry>) => any;
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  weightStr: string;
}

class WeightInput extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    let weight = this.props.weightKg;
    if (!this.props.inKg) {
      weight = kg2lbs(weight);
    }

    // Internal state, for purposes of validation.
    // To avoid confusion (auto-rounding) when typing, just store a String.
    this.state = {
      // Prefer displaying an empty string to 0.0.
      weightStr: weight === 0.0 ? "" : displayWeight(weight)
    };
  }

  getValidationState = () => {
    const weightNum = Number(this.state.weightStr);
    if (isNaN(weightNum) || weightNum < 0) return "error";
    if (this.props.multipleOf !== undefined && weightNum % this.props.multipleOf !== 0.0) {
      return "warning";
    }
    if (this.state.weightStr.length > 0) return "success";
    return null;
  };

  // Update the internal state, used for validation.
  handleChange = event => {
    const weightStr = event.target.value;
    this.setState({ weightStr: weightStr });
  };

  // Update the Redux store.
  handleBlur = event => {
    const weightStr = event.target.value;
    const weightNum = Number(weightStr);

    if (this.getValidationState() === "error") {
      return;
    }

    const weightKg = this.props.inKg ? weightNum : lbs2kg(weightNum);
    if (this.props.weightKg === weightKg) {
      return;
    }

    // If "attempt" is set, a specific attempt is selected.
    if (this.props.attemptOneIndexed !== undefined && this.props.lift !== undefined) {
      const attemptOneIndexed = this.props.attemptOneIndexed;
      const lift = this.props.lift;
      this.props.enterAttempt(this.props.id, lift, attemptOneIndexed, weightKg);
    } else {
      // Otherwise, the field is a Number.
      let newfields = {};
      newfields[this.props.field] = weightKg;
      this.props.updateRegistration(this.props.id, newfields);
    }
  };

  render() {
    // FormGroup provides a default padding of 15, but FormGroup is only being
    // used here to accept a validationState. It's not really a group.
    const undoDefaultPadding = { marginBottom: "0" };

    return (
      <FormGroup style={undoDefaultPadding} validationState={this.getValidationState()}>
        <FormControl
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          type="text"
          value={this.state.weightStr}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  // If `field` is set, then read the Number from the given field name.
  let weightKg = 0.0;
  if (ownProps.field !== undefined) {
    weightKg = entry[ownProps.field];
  } else {
    // Otherwise, refer to a specific lift and attempt.
    const lift = ownProps.lift;
    const attemptOneIndexed = ownProps.attemptOneIndexed;
    const field = liftToAttemptFieldName(lift);
    weightKg = entry[field][attemptOneIndexed - 1];
  }

  return {
    inKg: state.meet.inKg,
    weightKg: weightKg
  };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj)),
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeightInput);
