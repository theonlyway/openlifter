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

// An editable component for attempt manipulation in the LiftingContent.

import React, { FormEvent } from "react";
import { connect } from "react-redux";

import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { liftToAttemptFieldName, liftToStatusFieldName } from "../../logic/entry";
import { enterAttempt } from "../../actions/liftingActions";
import { kg2lbs, lbs2kg, displayWeight } from "../../logic/units";

import { Entry, Lift } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

import styles from "./LiftingTable.module.scss";
import { FormControlTypeHack } from "../../types/utils";
import { Dispatch } from "redux";

interface StateProps {
  inKg: boolean;
}

interface OwnProps {
  entry: Entry;
  lift: Lift;
  attemptOneIndexed: number;
  id: string;
}

interface DispatchProps {
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => void;
}

type Props = StateProps & OwnProps & DispatchProps;

interface InternalState {
  lastGoodValue: string;
  value: string;
}

class AttemptInput extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    const fieldKg = liftToAttemptFieldName(this.props.lift);
    const weightKg: number = this.props.entry[fieldKg][this.props.attemptOneIndexed - 1];

    let weightStr = "";
    if (weightKg !== 0) {
      weightStr = displayWeight(this.props.inKg ? weightKg : kg2lbs(weightKg));
    }

    this.state = {
      lastGoodValue: weightStr,
      value: weightStr
    };
  }

  getValidationState = () => {
    const { value } = this.state;
    if (value === "") return null;

    // Handle all errors before all warnings.
    // Check that the input is a number.
    const asNumber = Number(value);
    if (isNaN(asNumber)) return "error";
    if (!isFinite(asNumber)) return "error";
    if (asNumber < 0) return "error";

    // The bar weight must be monotonically increasing between attempts.
    if (this.props.attemptOneIndexed > 1) {
      const asKg = this.props.inKg ? asNumber : lbs2kg(asNumber);

      const entry = this.props.entry;
      const fieldKg = liftToAttemptFieldName(this.props.lift);
      const fieldStatus = liftToStatusFieldName(this.props.lift);

      const prevAttemptOneIndexed = this.props.attemptOneIndexed - 1;
      const prevKg = entry[fieldKg][prevAttemptOneIndexed - 1];
      const prevStatus = entry[fieldStatus][prevAttemptOneIndexed - 1];

      // The previous weight cannot be greater than the current weight.
      if (prevKg > asKg) return "error";

      // The current weight cannot repeat a successful attempt.
      if (prevKg === asKg && prevStatus === 1) return "error";

      // However, they can be equal if the previous attempt was failed.
      if (prevKg === asKg && prevStatus !== -1) return "warning";
    }

    if (asNumber % 2.5 !== 0) return "warning";
    return null;
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  handleChange = (event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (typeof value === "string") {
      let fixups = value.replace(",", ".").replace(" ", "");

      // Dvorak "e" corresponds to QWERTY ".", but also is used in exponential
      // notation, which is a fairly impactful typo.
      fixups = value.replace("e", ".");

      this.setState({ value: fixups });
    }
  };

  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (this.getValidationState() === "error") {
      this.setState({ value: this.state.lastGoodValue });
      return;
    }

    const entryId = this.props.entry.id;
    const lift = this.props.lift;
    const attemptOneIndexed = this.props.attemptOneIndexed;
    const asNumber = Number(this.state.value);
    const weightKg = this.props.inKg ? asNumber : lbs2kg(asNumber);

    this.props.enterAttempt(entryId, lift, attemptOneIndexed, weightKg);
    this.setState({ lastGoodValue: this.state.value });
  };

  render() {
    return (
      /* TODO: Validation state styling */
      <FormGroup style={{ marginBottom: 0 }}>
        <FormControl
          id={this.props.id}
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

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
    dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttemptInput);
