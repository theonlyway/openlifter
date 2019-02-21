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

// Defines a row in the LifterTable on the Weigh-inss page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";

import ValidatedTextInput from "../ValidatedTextInput";
import WeightInput from "./WeightInput";

import { validatePositiveInteger } from "../../validation/positiveInteger";

import { updateRegistration } from "../../actions/registrationActions";

import type { Entry, Validation } from "../../types/dataTypes";
import type { GlobalState, MeetState } from "../../types/stateTypes";

interface OwnProps {
  id: number;
}

interface StateProps {
  meet: MeetState;
  entry: Entry;
}

interface DispatchProps {
  updateRegistration: (entryId: number, obj: $Shape<Entry>) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

class LifterRow extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.updateRegistrationSquatRackInfo = this.updateRegistrationSquatRackInfo.bind(this);
    this.updateRegistrationBenchRackInfo = this.updateRegistrationBenchRackInfo.bind(this);
    this.updateRegistrationAge = this.updateRegistrationAge.bind(this);
  }

  updateRegistrationSquatRackInfo = (value: string) => {
    if (this.props.entry.squatRackInfo !== value) {
      this.props.updateRegistration(this.props.id, { squatRackInfo: value });
    }
  };

  updateRegistrationBenchRackInfo = (value: string) => {
    if (this.props.entry.benchRackInfo !== value) {
      this.props.updateRegistration(this.props.id, { benchRackInfo: value });
    }
  };

  updateRegistrationAge = (value: string) => {
    const age: number = value === "" ? 0 : Number(value);
    if (this.props.entry.age !== age) {
      this.props.updateRegistration(this.props.id, { age: age });
    }
  };

  validateAge = (value: ?string): Validation => {
    if (value === "") return null;

    const pos: Validation = validatePositiveInteger(value);
    if (pos === "success") {
      // Complain a little if the age is implausible.
      const n = Number(value);
      if (n <= 4 || n > 100) return "warning";
    }
    return pos;
  };

  validateRack = (value: ?string): Validation => {
    if (value === "") return null;
    return "success";
  };

  render() {
    const entry = this.props.entry;

    // Check whether the event(s) include a given lift.
    let hasSquat = false;
    let hasBench = false;
    let hasDeadlift = false;
    for (let i = 0; i < entry.events.length; i++) {
      const event = entry.events[i];
      if (event.includes("S")) {
        hasSquat = true;
      }
      if (event.includes("B")) {
        hasBench = true;
      }
      if (event.includes("D")) {
        hasDeadlift = true;
      }
    }

    // Check whether the first attempt already occurred.
    const disableSquatWeight = !hasSquat || entry.squatStatus[0] !== 0;
    const disableBenchWeight = !hasBench || entry.benchStatus[0] !== 0;
    const disableDeadliftWeight = !hasDeadlift || entry.deadliftStatus[0] !== 0;

    return (
      <tr>
        <td>{entry.platform}</td>
        <td>{entry.flight}</td>
        <td>{entry.name}</td>

        <td>
          <ValidatedTextInput
            initialValue={entry.age === 0 ? "" : String(entry.age)}
            placeholder="Age"
            getValidationState={this.validateAge}
            onSuccess={this.updateRegistrationAge}
          />
        </td>

        <td>
          <WeightInput id={this.props.id} field="bodyweightKg" placeholder="Bwt" disabled={false} />
        </td>

        <td>
          <ValidatedTextInput
            initialValue={entry.squatRackInfo}
            placeholder={hasSquat ? "S.Rack" : undefined}
            disabled={!hasSquat}
            getValidationState={this.validateRack}
            onSuccess={this.updateRegistrationSquatRackInfo}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="S"
            attemptOneIndexed={1}
            placeholder={hasSquat ? "Squat" : undefined}
            disabled={disableSquatWeight}
          />
        </td>

        <td>
          <ValidatedTextInput
            initialValue={entry.benchRackInfo}
            placeholder={hasBench ? "B.Rack" : undefined}
            disabled={!hasBench}
            getValidationState={this.validateRack}
            onSuccess={this.updateRegistrationBenchRackInfo}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="B"
            attemptOneIndexed={1}
            placeholder={hasBench ? "Bench" : undefined}
            disabled={disableBenchWeight}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="D"
            attemptOneIndexed={1}
            placeholder={hasDeadlift ? "Dead" : undefined}
            disabled={disableDeadliftWeight}
          />
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  return {
    meet: state.meet,
    entry: entry
  };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    updateRegistration: (entryId: number, obj: $Shape<Entry>) => dispatch(updateRegistration(entryId, obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
