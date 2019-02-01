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

// The footer of the Lifting page, contained by the LiftingView.
// This is the parent element of the controls that affect present lifting state.

import React from "react";
import { connect } from "react-redux";

import { FormControl } from "react-bootstrap";

import { markLift, overrideAttempt, overrideEntryId, setLiftingGroup } from "../../actions/liftingActions";

import type { Entry, Flight } from "../../types/dataTypes";
import type { GlobalState, LiftingState } from "../../types/stateTypes";

import styles from "./LiftingFooter.module.scss";

interface OwnProps {
  attemptOneIndexed: number;
  orderedEntries: Array<Entry>;
  currentEntryId: number | null;
  flightsOnPlatform: Array<Flight>;
  toggleReplaceTableWithWeighins: () => void;
}

interface StateProps {
  lifting: LiftingState;
  lengthDays: number;
  platformsOnDays: Array<number>;
}

interface DispatchProps {
  setLiftingGroup: any;
  overrideAttempt: any;
  overrideEntryId: any;
  markLift: any;
}

type Props = OwnProps & StateProps & DispatchProps;

const liftOptions = [
  <option key={"S"} value={"S"}>
    Squat
  </option>,
  <option key={"B"} value={"B"}>
    Bench
  </option>,
  <option key={"D"} value={"D"}>
    Deadlift
  </option>
];

const attemptOptions = [
  <option key={1} value={"1"}>
    Attempt 1
  </option>,
  <option key={2} value={"2"}>
    Attempt 2
  </option>,
  <option key={3} value={"3"}>
    Attempt 3
  </option>,
  <option key={4} value={"4"}>
    Attempt 4
  </option>
];

class LiftingFooter extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleFlightChange = this.handleFlightChange.bind(this);
    this.handleLiftChange = this.handleLiftChange.bind(this);

    this.handleGoodLift = this.handleGoodLift.bind(this);
    this.handleNoLift = this.handleNoLift.bind(this);

    this.handleAttemptChange = this.handleAttemptChange.bind(this);
    this.handleLifterChange = this.handleLifterChange.bind(this);

    this.makeLifterOptions = this.makeLifterOptions.bind(this);
  }

  handleDayChange = event => {
    const day = Number(event.target.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;

    // If the new day has fewer platforms, reset the platform selector also.
    let platform = this.props.lifting.platform;
    if (platform > this.props.platformsOnDays[day - 1]) {
      platform = 1;
    }

    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handlePlatformChange = event => {
    const day = this.props.lifting.day;
    const platform = Number(event.target.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handleFlightChange = event => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = event.target.value;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handleLiftChange = event => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = this.props.lifting.flight;
    const lift = event.target.value;
    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handleAttemptChange = event => {
    const attempt = Number(event.target.value);
    this.props.overrideAttempt(attempt);
  };

  handleLifterChange = event => {
    const entryId = Number(event.target.value);
    this.props.overrideEntryId(entryId);
  };

  handleGoodLift = () => {
    // If there's no active entry, there's nothing to set.
    if (this.props.currentEntryId === null) {
      return;
    }

    const entryId = Number(this.props.currentEntryId);
    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    this.props.markLift(entryId, lift, attempt, true);
  };

  handleNoLift = () => {
    // If there's no active entry, there's nothing to set.
    if (this.props.currentEntryId === null) {
      return;
    }

    const entryId = Number(this.props.currentEntryId);
    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    this.props.markLift(entryId, lift, attempt, false);
  };

  handleFullscreen = () => {
    // Document must be typecast to "any" because the fullscreen properties
    // used here aren't defined in the Flow Document type definition.
    if ((document: any).fullscreenElement !== null) {
      (document: any).exitFullscreen();
    } else {
      const liftingView = document.getElementById("liftingView");
      if (liftingView !== null) {
        liftingView.requestFullscreen();
      }
    }
  };

  makeLifterOptions = () => {
    const orderedEntries = this.props.orderedEntries;

    if (orderedEntries.length === 0) {
      return (
        <option value={0} key={0}>
          No Lifters
        </option>
      );
    }

    let lifterOptions = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      lifterOptions.push(
        <option value={entry.id} key={entry.id}>
          {entry.name}
        </option>
      );
    }
    return lifterOptions;
  };

  render() {
    const numPlatforms = this.props.platformsOnDays[this.props.lifting.day - 1];

    let dayOptions = [];
    for (let i = 1; i <= this.props.lengthDays; i++) {
      const label = "Day " + String(i);
      dayOptions.push(
        <option value={i} key={i}>
          {label}
        </option>
      );
    }

    let platformOptions = [];
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          Platform {i}
        </option>
      );
    }

    let flightOptions = [];
    for (let i = 0; i < this.props.flightsOnPlatform.length; i++) {
      const flight = this.props.flightsOnPlatform[i];
      const key = this.props.lifting.day + "-" + this.props.lifting.platform + "-" + i;
      flightOptions.push(
        <option value={flight} key={key}>
          Flight {flight}
        </option>
      );
    }

    const currentEntryId = this.props.currentEntryId === null ? undefined : this.props.currentEntryId;

    return (
      <div className={styles.footer}>
        <div className={styles.leftControls}>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.day}
            onChange={this.handleDayChange}
            className={styles.selector}
          >
            {dayOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.platform}
            onChange={this.handlePlatformChange}
            className={styles.selector}
          >
            {platformOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.lift}
            onChange={this.handleLiftChange}
            className={styles.selector}
          >
            {liftOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.flight}
            onChange={this.handleFlightChange}
            className={styles.selector}
          >
            {flightOptions}
          </FormControl>
          <FormControl
            value={this.props.attemptOneIndexed}
            componentClass="select"
            onChange={this.handleAttemptChange}
            className={styles.selector}
          >
            {attemptOptions}
          </FormControl>
          <FormControl
            value={currentEntryId}
            componentClass="select"
            onChange={this.handleLifterChange}
            className={styles.selector}
          >
            {this.makeLifterOptions()}
          </FormControl>
        </div>

        <div className={styles.rightControls}>
          <button type="button" onClick={this.props.toggleReplaceTableWithWeighins}>
            Toggle Weigh-ins
          </button>
          <button type="button" onClick={this.handleFullscreen} className={styles.fullscreen}>
            Toggle Fullscreen
          </button>
          <button type="button" onMouseDown={this.handleNoLift} className={styles.noLift}>
            No Lift
          </button>
          <button type="button" onMouseDown={this.handleGoodLift} className={styles.goodLift}>
            Good Lift
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    lengthDays: state.meet.lengthDays,
    platformsOnDays: state.meet.platformsOnDays,
    lifting: state.lifting
  };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setLiftingGroup: (day, platform, flight, lift) => dispatch(setLiftingGroup(day, platform, flight, lift)),
    overrideAttempt: attempt => dispatch(overrideAttempt(attempt)),
    overrideEntryId: entryId => dispatch(overrideEntryId(entryId)),
    markLift: (entryId, lift, attempt, success) => dispatch(markLift(entryId, lift, attempt, success))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftingFooter);
