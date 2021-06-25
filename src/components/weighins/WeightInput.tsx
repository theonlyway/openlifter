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

// Defines an input of a single weight, during configuration.
// Since it's for configuration, it doesn't have an associated success/failure value.
//
// For consistency purposes, weights are always stored in kg.

import React from "react";
import { connect } from "react-redux";

import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { updateRegistration } from "../../actions/registrationActions";
import { enterAttempt } from "../../actions/liftingActions";

import { liftToAttemptFieldName } from "../../logic/entry";
import { kg2lbs, lbs2kg, string2number, displayWeight } from "../../logic/units";

import { Entry, Language, Lift, Validation } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { assertString } from "../../types/utils";
import { Dispatch } from "redux";

interface OwnProps {
  id: number; // The EntryID.

  // The valid type here should be all keys of Entry where the value is a number
  // Something like keyof<Partial> where (key,value) => typeof value === Number - if that is possible in typescript?
  // Otherwise manually specifying all the valid keys of Entry is a fair approach too!
  field?: "bodyweightKg";
  disabled: boolean;

  // Optional attributes used only for lifts (as opposed to for bodyweights).
  placeholder?: string;
  lift?: Lift;
  attemptOneIndexed?: number;
  multipleOf?: number;
}

interface StateProps {
  inKg: boolean;
  weightKg: number;
  language: Language;
}

interface DispatchProps {
  updateRegistration: (entryId: number, obj: Partial<Entry>) => void;
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  weightStr: string;
}

class WeightInput extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);
    this.validate = this.validate.bind(this);
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
      weightStr: weight === 0.0 ? "" : displayWeight(weight, props.language),
    };
  }

  validate = (): Validation => {
    const weightNum = string2number(this.state.weightStr);
    if (isNaN(weightNum) || weightNum < 0) return "error";
    if (this.props.multipleOf !== undefined && weightNum % this.props.multipleOf !== 0.0) {
      return "warning";
    }
    if (this.state.weightStr.length > 0) return "success";
    return null;
  };

  // Update the internal state, used for validation.
  handleChange = (event: React.BaseSyntheticEvent) => {
    const weightStr = event.currentTarget.value;
    if (assertString(weightStr)) {
      this.setState({ weightStr: weightStr });
    }
  };

  // Update the Redux store.
  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const weightNum = string2number(event.currentTarget.value);

    if (this.validate() === "error") {
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
    } else if (this.props.field !== undefined) {
      // Otherwise, the field is a Number.
      const newfields: Partial<Entry> = {};
      newfields[this.props.field] = weightKg;
      this.props.updateRegistration(this.props.id, newfields);
    }
  };

  render() {
    // FormGroup provides a default padding of 15, but FormGroup is only being
    // used here to accept a validationState. It's not really a group.
    const undoDefaultPadding = { marginBottom: "0" };
    const validation: Validation = this.validate();

    return (
      <FormGroup style={undoDefaultPadding}>
        <FormControl
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          type="text"
          value={this.state.weightStr}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          isValid={validation === "success"}
          isInvalid={validation === "error"}
          className={validation === "warning" ? "is-warning" : undefined}
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
  } else if (ownProps.lift !== undefined && ownProps.attemptOneIndexed !== undefined) {
    // Otherwise, refer to a specific lift and attempt.
    const lift = ownProps.lift;
    const attemptOneIndexed = ownProps.attemptOneIndexed;
    const field = liftToAttemptFieldName(lift);
    weightKg = entry[field][attemptOneIndexed - 1];
  }

  return {
    inKg: state.meet.inKg,
    weightKg: weightKg,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj)),
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightInput);
