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

import { enterAttempt } from "../../actions/liftingActions";

import type { Lift } from "../../reducers/registrationReducer";

import styles from "./LiftingTable.module.scss";

type Props = {
  entryId: number,
  lift: Lift,
  attemptOneIndexed: number,
  weightKg: number,
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => any
};

type State = {
  value: string
};

class AttemptInput extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    let weightStr = "";
    if (this.props.weightKg !== 0) {
      weightStr = String(this.props.weightKg);
    }

    this.state = {
      value: weightStr
    };
  }

  getValidationState() {
    const { value } = this.state;

    if (value === "") return null;

    const asNumber = Number(value);
    if (isNaN(asNumber)) return "error";
    if (asNumber % 2.5 !== 0) return "warning";
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

    const entryId = this.props.entryId;
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

const mapDispatchToProps = dispatch => {
  return {
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(AttemptInput);
