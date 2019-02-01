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

// An editable component for attempt manipulation in the LiftingContent.

import React from "react";
import { connect } from "react-redux";

import { FormControl, FormGroup } from "react-bootstrap";

import { liftToAttemptFieldName, liftToStatusFieldName } from "../../logic/entry";
import { enterAttempt } from "../../actions/liftingActions";

import type { Entry, Lift } from "../../types/dataTypes";

import styles from "./LiftingTable.module.scss";

interface OwnProps {
  entry: Entry;
  lift: Lift;
  attemptOneIndexed: number;
}

interface DispatchProps {
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => any;
}

type Props = OwnProps & DispatchProps;

interface InternalState {
  value: string;
}

class AttemptInput extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    const fieldKg = liftToAttemptFieldName(this.props.lift);
    const weightKg: number = this.props.entry[fieldKg][this.props.attemptOneIndexed - 1];

    let weightStr = "";
    if (weightKg !== 0) {
      weightStr = String(weightKg);
    }

    this.state = {
      value: weightStr
    };
  }

  getValidationState() {
    const { value } = this.state;
    if (value === "") return null;

    // Check that the input is a number.
    const asNumber = Number(value);
    if (isNaN(asNumber)) return "error";
    if (asNumber % 2.5 !== 0) return "warning";

    // The bar weight must be monotonically increasing between attempts.
    if (this.props.attemptOneIndexed > 1) {
      const entry = this.props.entry;
      const fieldKg = liftToAttemptFieldName(this.props.lift);
      const fieldStatus = liftToStatusFieldName(this.props.lift);

      const prevAttemptOneIndexed = this.props.attemptOneIndexed - 1;
      const prevKg = entry[fieldKg][prevAttemptOneIndexed - 1];
      const prevStatus = entry[fieldStatus][prevAttemptOneIndexed - 1];

      // The previous weight cannot be greater than the current weight.
      if (prevKg > asNumber) return "warning";

      // However, they can be equal if the previous attempt was failed.
      if (prevKg === asNumber && prevStatus !== -1) return "warning";
    }

    return null;
  }

  handleKeyDown = event => {
    if (event.key === "Enter") {
      this.handleBlur(event);
    }
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState({ value: value });
  };

  handleBlur = event => {
    if (this.getValidationState() === "error") {
      return;
    }

    const entryId = this.props.entry.id;
    const lift = this.props.lift;
    const attemptOneIndexed = this.props.attemptOneIndexed;
    const weightKg = Number(this.state.value);

    this.props.enterAttempt(entryId, lift, attemptOneIndexed, weightKg);
  };

  render() {
    return (
      <FormGroup validationState={this.getValidationState()} style={{ marginBottom: 0 }}>
        <FormControl
          type="text"
          placeholder=""
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          className={styles.attemptInput}
        />
      </FormGroup>
    );
  }
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(AttemptInput);
