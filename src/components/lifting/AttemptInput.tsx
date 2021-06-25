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

import React from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";

import { liftToAttemptFieldName, liftToStatusFieldName } from "../../logic/entry";
import { enterAttempt } from "../../actions/liftingActions";
import { kg2lbs, lbs2kg, string2number, displayWeight } from "../../logic/units";

import { Entry, Language, Lift, Validation } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

import styles from "./LiftingTable.module.scss";
import { Dispatch } from "redux";

interface StateProps {
  inKg: boolean;
  language: Language;
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

    this.validate = this.validate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    const fieldKg = liftToAttemptFieldName(this.props.lift);
    const weightKg: number = this.props.entry[fieldKg][this.props.attemptOneIndexed - 1];

    let weightStr = "";
    if (weightKg !== 0) {
      weightStr = displayWeight(this.props.inKg ? weightKg : kg2lbs(weightKg), this.props.language);
    }

    this.state = {
      lastGoodValue: weightStr,
      value: weightStr,
    };
  }

  validate = (): Validation => {
    let { value } = this.state;
    if (value === "") return null;

    // Allow use of commas as decimal separator.
    value = value.replace(",", ".");

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

      // Check for validity against all previous attempts.
      for (let i = 0; i < prevAttemptOneIndexed; ++i) {
        const prevWeightKg = entry[fieldKg][i];

        // Disallow this weight if it's a decrease from a previous attempt.
        if (prevWeightKg > asKg) return "error";

        if (prevWeightKg === asKg) {
          const prevStatus = entry[fieldStatus][i];

          // Disallow this weight if it was already successfully lifted.
          if (prevStatus === 1) return "error";

          // If the weight is a repeat but has no status, allow it, but complain.
          if (prevStatus === 0) return "warning";
        }
      }
    }

    if (asNumber % 2.5 !== 0) return "warning";
    return null;
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  handleChange = (event: React.BaseSyntheticEvent) => {
    const value = event.currentTarget.value;
    if (typeof value === "string") {
      let fixups = value.replace(" ", "");

      // Dvorak "e" corresponds to QWERTY ".", but also is used in exponential
      // notation, which is a fairly impactful typo.
      fixups = value.replace("e", ".");

      this.setState({ value: fixups });
    }
  };

  handleBlur = () => {
    if (this.validate() === "error") {
      this.setState({ value: this.state.lastGoodValue });
      return;
    }

    const entryId = this.props.entry.id;
    const lift = this.props.lift;
    const attemptOneIndexed = this.props.attemptOneIndexed;
    const asNumber = string2number(this.state.value);
    const weightKg = this.props.inKg ? asNumber : lbs2kg(asNumber);

    this.props.enterAttempt(entryId, lift, attemptOneIndexed, weightKg);
    this.setState({ lastGoodValue: this.state.value });
  };

  render() {
    const validation: Validation = this.validate();

    return (
      <Form.Group style={{ marginBottom: 0 }}>
        <Form.Control
          id={this.props.id}
          type="text"
          placeholder=""
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          // Nothing for Valid == we don't want borders.
          isInvalid={validation === "error"}
          // Special rules in the _openlifter.scss override warning styles.
          // Makes the borders look normal but shows a yellow background.
          className={(validation === "warning" ? "is-warning " : "") + styles.attemptInput + " attempt-input"}
        />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
    dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AttemptInput);
