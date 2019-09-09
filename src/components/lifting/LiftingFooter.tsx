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

// The footer of the Lifting page, contained by the LiftingView.
// This is the parent element of the controls that affect present lifting state.

import React, { FormEvent } from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import { globalFocusAttemptInputId } from "./LiftingTable";

import { markLift, overrideAttempt, overrideEntryId, setLiftingGroup } from "../../actions/liftingActions";

import { Entry, Flight, Lift } from "../../types/dataTypes";
import { GlobalState, LiftingState } from "../../types/stateTypes";

import styles from "./LiftingFooter.module.scss";
import { Dispatch } from "redux";
import { FormControlTypeHack, assertFlight, assertString, assertLift } from "../../types/utils";

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
  allow4thAttempts: boolean;
}

interface DispatchProps {
  setLiftingGroup: (day: number, platform: number, flight: Flight, lift: Lift) => void;
  overrideAttempt: (attempt: number) => void;
  overrideEntryId: (entryId: number) => void;
  markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) => void;
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

class LiftingFooter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleFlightChange = this.handleFlightChange.bind(this);
    this.handleLiftChange = this.handleLiftChange.bind(this);

    this.handleGoodLift = this.handleGoodLift.bind(this);
    this.handleNoLift = this.handleNoLift.bind(this);

    this.handleAttemptChange = this.handleAttemptChange.bind(this);
    this.handleLifterChange = this.handleLifterChange.bind(this);

    this.setFocusAttemptInputTimeout = this.setFocusAttemptInputTimeout.bind(this);

    this.makeLifterOptions = this.makeLifterOptions.bind(this);
  }

  handleDayChange = (event: FormEvent<FormControlTypeHack>) => {
    const day = Number(event.currentTarget.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;

    // If the new day has fewer platforms, reset the platform selector also.
    let platform = this.props.lifting.platform;
    if (platform > this.props.platformsOnDays[day - 1]) {
      platform = 1;
    }

    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handlePlatformChange = (event: FormEvent<FormControlTypeHack>) => {
    const day = this.props.lifting.day;
    const platform = Number(event.currentTarget.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handleFlightChange = (event: FormEvent<FormControlTypeHack>) => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = event.currentTarget.value;
    const lift = this.props.lifting.lift;
    if (assertString(flight) && assertFlight(flight)) {
      this.props.setLiftingGroup(day, platform, flight, lift);
    }
  };

  handleLiftChange = (event: FormEvent<FormControlTypeHack>) => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = "A"; // Always reset to Flight A.
    const lift = event.currentTarget.value;
    if (assertString(lift) && assertLift(lift)) {
      this.props.setLiftingGroup(day, platform, flight, lift);
    }
  };

  handleAttemptChange = (event: FormEvent<FormControlTypeHack>) => {
    const attempt = Number(event.currentTarget.value);
    this.props.overrideAttempt(attempt);
  };

  handleLifterChange = (event: FormEvent<FormControlTypeHack>) => {
    const entryId = Number(event.currentTarget.value);
    this.props.overrideEntryId(entryId);
  };

  // After a "No Lift" or "Good Lift" button is clicked, try to change focus
  // to the AttemptInput that the score table is likely to want to type into.
  setFocusAttemptInputTimeout = () => {
    if (globalFocusAttemptInputId === null) {
      return;
    }

    // Auto-focusing is significantly less useful on 3rd attempts and beyond.
    if (this.props.attemptOneIndexed >= 3) {
      return;
    }

    setTimeout(function() {
      if (globalFocusAttemptInputId === null) {
        return;
      }

      const elem = document.getElementById(globalFocusAttemptInputId);
      if (elem) {
        elem.focus();
      }
    }, 100);
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
    this.setFocusAttemptInputTimeout();
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
    this.setFocusAttemptInputTimeout();
  };

  // Check whether "document.fullscreenElement" exists, including prefixes.
  hasFullscreenElement = (): boolean => {
    let doc: any = document;
    if (doc.fullscreenElement) return true;
    if (doc.webkitFullscreenElement) return true;
    if (doc.mozFullscreenElement) return true;
    if (doc.msFullscreenElement) return true;
    return false;
  };

  // Calls exitFullscreen(), but with prefixes.
  exitFullscreen = () => {
    let doc: any = document;
    if (typeof doc.exitFullscreen === "function") doc.exitFullscreen();
    else if (typeof doc.webkitExitFullscreen === "function") doc.webkitExitFullscreen();
    else if (typeof doc.mozExitFullscreen === "function") doc.mozExitFullscreen();
    else if (typeof doc.msExitFullscreen === "function") doc.msExitFullscreen();
  };

  // Calls requestFullscreen(), but with prefixes.
  requestFullscreen = (e: any) => {
    if (typeof e.requestFullscreen === "function") e.requestFullscreen();
    else if (typeof e.webkitRequestFullscreen === "function") e.webkitRequestFullscreen();
    else if (typeof e.mozRequestFullscreen === "function") e.mozRequestFullscreen();
    else if (typeof e.msRequestFullscreen === "function") e.msRequestFullscreen();
  };

  // Called when the "Toggle Fullscreen" button is clicked.
  handleFullscreen = () => {
    // Document must be typecast to "any" because the fullscreen properties
    // used here aren't defined in the Flow Document type definition.
    if (this.hasFullscreenElement() === true) {
      this.exitFullscreen();
    } else {
      const liftingView = document.getElementById("liftingView");
      if (liftingView !== null) {
        this.requestFullscreen(liftingView);
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
    if (flightOptions.length === 0) {
      flightOptions.push(<option key="none">No Flights</option>);
    }

    let attemptOptions = [];
    for (let i = 1; i <= 3; i++) {
      attemptOptions.push(
        <option key={i} value={i}>
          Attempt {i}
        </option>
      );
    }
    if (this.props.allow4thAttempts === true) {
      attemptOptions.push(
        <option key={4} value={4}>
          Attempt 4
        </option>
      );
    }

    const currentEntryId = this.props.currentEntryId === null ? undefined : this.props.currentEntryId.toString();

    return (
      <div className={styles.footer}>
        <div className={styles.leftControls}>
          <Form.Control
            as="select"
            defaultValue={this.props.lifting.day.toString()}
            onChange={this.handleDayChange}
            className={`custom-select ${styles.selector}`}
          >
            {dayOptions}
          </Form.Control>
          <Form.Control
            as="select"
            defaultValue={this.props.lifting.platform.toString()}
            onChange={this.handlePlatformChange}
            className={`custom-select ${styles.selector}`}
          >
            {platformOptions}
          </Form.Control>
          <Form.Control
            as="select"
            defaultValue={this.props.lifting.lift}
            onChange={this.handleLiftChange}
            className={`custom-select ${styles.selector}`}
          >
            {liftOptions}
          </Form.Control>
          <Form.Control
            key={"flight-" + this.props.lifting.flight}
            as="select"
            defaultValue={this.props.lifting.flight}
            onChange={this.handleFlightChange}
            className={`custom-select ${styles.selector}`}
          >
            {flightOptions}
          </Form.Control>
          <Form.Control
            value={this.props.attemptOneIndexed.toString()}
            as="select"
            onChange={this.handleAttemptChange}
            className={`custom-select ${styles.selector}`}
          >
            {attemptOptions}
          </Form.Control>
          <Form.Control
            value={currentEntryId}
            as="select"
            onChange={this.handleLifterChange}
            className={`custom-select ${styles.selector}`}
          >
            {this.makeLifterOptions()}
          </Form.Control>
        </div>

        <div className={styles.rightControls}>
          <ButtonGroup>
            <Button variant="outline-primary" onClick={this.props.toggleReplaceTableWithWeighins}>
              Toggle Weigh-ins
            </Button>
            <Button variant="outline-secondary" onClick={this.handleFullscreen} className={styles.fullscreen}>
              Toggle Fullscreen
            </Button>
          </ButtonGroup>
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

const mapStateToProps = (state: GlobalState) => {
  return {
    lengthDays: state.meet.lengthDays,
    platformsOnDays: state.meet.platformsOnDays,
    allow4thAttempts: state.meet.allow4thAttempts,
    lifting: state.lifting
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLiftingGroup: (day: number, platform: number, flight: Flight, lift: Lift) =>
      dispatch(setLiftingGroup(day, platform, flight, lift)),
    overrideAttempt: (attempt: number) => dispatch(overrideAttempt(attempt)),
    overrideEntryId: (entryId: number) => dispatch(overrideEntryId(entryId)),
    markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) =>
      dispatch(markLift(entryId, lift, attempt, success))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftingFooter);
