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

// Fills the Lifting page with random valid lift data for debugging purposes.

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Button from "react-bootstrap/Button";

import LocalizedString from "../translations/LocalizedString";

import { randomAttempt, randomAttemptWithMin } from "./RandomizeHelpers";

import { markLift, enterAttempt } from "../../actions/liftingActions";

import { GlobalState, MeetState, RegistrationState } from "../../types/stateTypes";
import { Lift } from "../../types/dataTypes";

interface StateProps {
  meet: MeetState;
  registration: RegistrationState;
}

interface DispatchProps {
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => void;
  markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) => void;
}

type Props = StateProps & DispatchProps;

class RandomizeLiftingButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.randomizeLifting = this.randomizeLifting.bind(this);
  }
  setLiftsForLift(entryId: number, lift: Lift, inKg: boolean) {
    // enter opener
    const firstAttempt = randomAttempt(inKg);
    this.props.enterAttempt(entryId, lift, 1, firstAttempt);

    // set random chance of failing attempt
    let success = Math.random() > 0.15;

    // mark opener as success or failure
    this.props.markLift(entryId, lift, 1, success);

    // enter 2nd attempt
    // re-take first attempt if it failed
    let secondAttempt = firstAttempt;

    if (success) {
      // increase attempt if opener was successful
      secondAttempt = randomAttemptWithMin(inKg, firstAttempt + 1);
    }
    this.props.enterAttempt(entryId, lift, 2, secondAttempt);

    // set slightly higher chance of failing 2nd
    success = Math.random() > 0.25;

    // mark 2nd lift success or failure
    this.props.markLift(entryId, lift, 2, success);

    // record 3rd attempt
    let thirdAttempt = secondAttempt;
    if (success) {
      // increment weight for 3rd
      thirdAttempt = randomAttemptWithMin(inKg, secondAttempt + 1);
    }
    this.props.enterAttempt(entryId, lift, 3, thirdAttempt);

    // set slightly higher chance of failing 3rd
    success = Math.random() > 0.3;
    // record success or failure
    this.props.markLift(entryId, lift, 3, success);
  }

  randomizeLifting = () => {
    const entries = this.props.registration.entries;
    const inKg: boolean = this.props.meet.inKg;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Figure out which events we're generating lift data for.
      let hasSquat = false;
      let hasBench = false;
      let hasDeadlift = false;

      for (let j = 0; j < entry.events.length; j++) {
        const e = entry.events[j];
        if (e.includes("S")) {
          hasSquat = true;
        }
        if (e.includes("B")) {
          hasBench = true;
        }
        if (e.includes("D")) {
          hasDeadlift = true;
        }
      }

      // Set 1st, 2nd, and 3rd for each lift.
      if (hasSquat) {
        this.setLiftsForLift(entry.id, "S", inKg);
      }
      if (hasBench) {
        this.setLiftsForLift(entry.id, "B", inKg);
      }
      if (hasDeadlift) {
        this.setLiftsForLift(entry.id, "D", inKg);
      }
    }
  };
  render() {
    return (
      <Button onClick={this.randomizeLifting}>
        <LocalizedString id="nav.lifting" />
      </Button>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  meet: state.meet,
  registration: state.registration,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) =>
    dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg)),
  markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) =>
    dispatch(markLift(entryId, lift, attempt, success)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RandomizeLiftingButton);
