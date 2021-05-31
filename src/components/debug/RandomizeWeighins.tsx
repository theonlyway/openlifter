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

// Randomizes the Registration page, for debugging.

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Button from "react-bootstrap/Button";

import LocalizedString from "../translations/LocalizedString";

import { randomAttempt, randomInt, randomFixedPoint } from "./RandomizeHelpers";
import { lbs2kg } from "../../logic/units";

import { updateRegistration } from "../../actions/registrationActions";
import { enterAttempt } from "../../actions/liftingActions";

import { GlobalState, MeetState, RegistrationState } from "../../types/stateTypes";
import { Entry, Lift } from "../../types/dataTypes";

interface StateProps {
  meet: MeetState;
  registration: RegistrationState;
}

interface DispatchProps {
  updateRegistration: (entryId: number, obj: Partial<Entry>) => void;
  enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => void;
}

type Props = StateProps & DispatchProps;

class RandomizeWeighinsButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.randomizeWeighins = this.randomizeWeighins.bind(this);
  }

  randomAttempt = () => {
    return randomAttempt(this.props.meet.inKg);
  };

  randomizeWeighins = () => {
    const entries = this.props.registration.entries;
    const inKg: boolean = this.props.meet.inKg;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Get a random bodyweight.
      // ==========================================
      const bodyweightKg = inKg ? randomFixedPoint(20, 150, 1) : lbs2kg(randomFixedPoint(40, 320, 1));
      this.props.updateRegistration(entry.id, {
        bodyweightKg: bodyweightKg,
      });

      // Get a random age.
      const age = randomInt(5, 79);
      this.props.updateRegistration(entry.id, {
        age: age,
      });

      // Figure out which events we're generating information for.
      // ==========================================
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

      // Set attempts.
      // ==========================================
      if (hasSquat) {
        this.props.enterAttempt(entry.id, "S", 1, this.randomAttempt());
      }
      if (hasBench) {
        this.props.enterAttempt(entry.id, "B", 1, this.randomAttempt());
      }
      if (hasDeadlift) {
        this.props.enterAttempt(entry.id, "D", 1, this.randomAttempt());
      }

      // Set rack info.
      // ==========================================
      if (hasSquat) {
        const height = String(randomInt(2, 18));
        const pos = Math.random() < 0.9 ? "out" : "in";
        this.props.updateRegistration(entry.id, {
          squatRackInfo: height + pos,
        });
      }

      if (hasBench) {
        const height = String(randomInt(0, 12));
        const safety = String(randomInt(0, 4));
        this.props.updateRegistration(entry.id, {
          benchRackInfo: height + "/" + safety,
        });
      }
    }
  };

  render() {
    return (
      <Button onClick={this.randomizeWeighins}>
        <LocalizedString id="nav.weigh-ins" />
      </Button>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  meet: state.meet,
  registration: state.registration,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj)),
  enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
    dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RandomizeWeighinsButton);
