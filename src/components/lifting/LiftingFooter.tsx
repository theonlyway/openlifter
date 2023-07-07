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

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import { globalFocusAttemptInputId } from "./LiftingTable";

import { getString, localizeFlight } from "../../logic/strings";
import { displayNumber } from "../../logic/units";

import { markLift, overrideAttempt, overrideEntryId, setLiftingGroup } from "../../actions/liftingActions";

import { Entry, Flight, Language, Lift } from "../../types/dataTypes";
import { GlobalState, LiftingState } from "../../types/stateTypes";

import styles from "./LiftingFooter.module.scss";
import { Dispatch } from "redux";
import { assertFlight, assertString, assertLift } from "../../types/utils";

interface OwnProps {
  attemptOneIndexed: number;
  orderedEntries: ReadonlyArray<Readonly<Entry>>;
  currentEntryId: number | null;
  flightsOnPlatform: ReadonlyArray<Flight>;
  toggleReplaceTableWithWeighins: () => void;
}

interface StateProps {
  lifting: LiftingState;
  lengthDays: number;
  platformsOnDays: ReadonlyArray<number>;
  allow4thAttempts: boolean;
  language: Language;
}

interface DispatchProps {
  setLiftingGroup: (day: number, platform: number, flight: Flight, lift: Lift) => void;
  overrideAttempt: (attempt: number) => void;
  overrideEntryId: (entryId: number) => void;
  markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class LiftingFooter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleFlightChange = this.handleFlightChange.bind(this);
    this.handleLiftChange = this.handleLiftChange.bind(this);

    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
    this.handleGoodLift = this.handleGoodLift.bind(this);
    this.handleNoLift = this.handleNoLift.bind(this);

    this.handleAttemptChange = this.handleAttemptChange.bind(this);
    this.handleLifterChange = this.handleLifterChange.bind(this);

    this.setFocusAttemptInputTimeout = this.setFocusAttemptInputTimeout.bind(this);

    this.makeLifterOptions = this.makeLifterOptions.bind(this);
  }

  handleDayChange = (event: React.BaseSyntheticEvent) => {
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

  handlePlatformChange = (event: React.BaseSyntheticEvent) => {
    const day = this.props.lifting.day;
    const platform = Number(event.currentTarget.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  };

  handleFlightChange = (event: React.BaseSyntheticEvent) => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = event.currentTarget.value;
    const lift = this.props.lifting.lift;
    if (assertString(flight) && assertFlight(flight)) {
      this.props.setLiftingGroup(day, platform, flight, lift);
    }
  };

  handleLiftChange = (event: React.BaseSyntheticEvent) => {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = "A"; // Always reset to Flight A.
    const lift = event.currentTarget.value;
    if (assertString(lift) && assertLift(lift)) {
      this.props.setLiftingGroup(day, platform, flight, lift);
    }
  };

  handleAttemptChange = (event: React.BaseSyntheticEvent) => {
    const attempt = Number(event.currentTarget.value);
    this.props.overrideAttempt(attempt);
    //also override EntryId so that we stay on the current
    //lifter when changing attempt, otherwise liftingOrder.ts:getCurrentEntryId()
    //can't figure out the current entry based on which entries have
    //attempt weights entered and taken or not taken, and we
    //end up with "Flight Complete" unless the entry would be separately
    //overridden via the lifter change control
    if (this.props.currentEntryId !== null) {
      const entryId = Number(this.props.currentEntryId);
      this.props.overrideEntryId(entryId);
    }
  };

  handleLifterChange = (event: React.BaseSyntheticEvent) => {
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

    setTimeout(function () {
      if (globalFocusAttemptInputId === null) {
        return;
      }

      const elem = document.getElementById(globalFocusAttemptInputId);
      if (elem) {
        elem.focus();
      }
    }, 100);
  };

  // This resolves Issue #224. The Good Lift and No Lift buttons are connected
  // to onMouseDown handlers to greatly improve responsive feel. However, that
  // means that an onBlur event is not fired for any AttemptInput that is
  // currently being edited. We need to ensure that it's fired, just as if we
  // were using a normal onClick handler.
  //
  // To ensure that any current AttemptInput is blurred, an onMouseEnter handler
  // is added that always blurs the currently-focused element. Because there are
  // several hundred milliseconds between onMouseEnter and onMouseDown due to
  // human reaction timing, the onBlur event will fully-execute before onMouseDown.
  handleOnMouseEnter = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
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
    const doc: any = document;
    if (doc.fullscreenElement) return true;
    if (doc.webkitFullscreenElement) return true;
    if (doc.mozFullscreenElement) return true;
    if (doc.msFullscreenElement) return true;
    return false;
  };

  // Calls exitFullscreen(), but with prefixes.
  exitFullscreen = () => {
    const doc: any = document;
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
          {getString("lifting.footer-no-lifters", this.props.language)}
        </option>
      );
    }

    const lifterOptions = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      lifterOptions.push(
        <option value={entry.id} key={entry.id}>
          {entry.name}
        </option>,
      );
    }
    return lifterOptions;
  };

  render() {
    const language = this.props.language;
    const numPlatforms = this.props.platformsOnDays[this.props.lifting.day - 1];

    const dayOptions = [];
    const dayTemplate = getString("lifting.footer-day-template", language);
    for (let i = 1; i <= this.props.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          {dayTemplate.replace("{N}", displayNumber(i, language))}
        </option>,
      );
    }

    const platformOptions = [];
    const platformTemplate = getString("lifting.footer-platform-template", language);
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          {platformTemplate.replace("{N}", displayNumber(i, language))}
        </option>,
      );
    }

    const liftOptions = [
      <option key={"S"} value={"S"}>
        {getString("lifting.footer-squat", language)}
      </option>,
      <option key={"B"} value={"B"}>
        {getString("lifting.footer-bench", language)}
      </option>,
      <option key={"D"} value={"D"}>
        {getString("lifting.footer-deadlift", language)}
      </option>,
    ];

    const flightOptions = [];
    const flightTemplate = getString("lifting.footer-flight-template", language);
    for (let i = 0; i < this.props.flightsOnPlatform.length; i++) {
      const flight = this.props.flightsOnPlatform[i];
      const key = this.props.lifting.day + "-" + this.props.lifting.platform + "-" + i;
      flightOptions.push(
        <option value={flight} key={key}>
          {flightTemplate.replace("{flight}", localizeFlight(flight, language))}
        </option>,
      );
    }
    if (flightOptions.length === 0) {
      flightOptions.push(<option key="none">{getString("lifting.footer-no-flights", language)}</option>);
    }

    const attemptOptions = [];
    const attemptTemplate = getString("lifting.footer-attempt-template", language);
    for (let i = 1; i <= 3; i++) {
      attemptOptions.push(
        <option key={i} value={i}>
          {attemptTemplate.replace("{N}", displayNumber(i, language))}
        </option>,
      );
    }
    if (this.props.allow4thAttempts === true) {
      attemptOptions.push(
        <option key={4} value={4}>
          {attemptTemplate.replace("{N}", displayNumber(4, language))}
        </option>,
      );
    }

    const currentEntryId = this.props.currentEntryId === null ? undefined : this.props.currentEntryId.toString();

    return (
      <div className={styles.footer}>
        <div className={styles.leftControls}>
          <Form.Control
            as="select"
            value={this.props.lifting.day.toString()}
            onChange={this.handleDayChange}
            className={`custom-select ${styles.selector}`}
          >
            {dayOptions}
          </Form.Control>
          <Form.Control
            as="select"
            value={this.props.lifting.platform.toString()}
            onChange={this.handlePlatformChange}
            className={`custom-select ${styles.selector}`}
          >
            {platformOptions}
          </Form.Control>
          <Form.Control
            as="select"
            value={this.props.lifting.lift}
            onChange={this.handleLiftChange}
            className={`custom-select ${styles.selector}`}
          >
            {liftOptions}
          </Form.Control>
          <Form.Control
            key={"flight-" + this.props.lifting.flight}
            as="select"
            value={this.props.lifting.flight}
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
              <FormattedMessage id="lifting.button-toggle-weigh-ins" defaultMessage="Toggle Weigh-ins" />
            </Button>
            <Button variant="outline-secondary" onClick={this.handleFullscreen} className={styles.fullscreen}>
              <FormattedMessage id="lifting.button-toggle-fullscreen" defaultMessage="Toggle Fullscreen" />
            </Button>
          </ButtonGroup>
          <button
            type="button"
            onMouseEnter={this.handleOnMouseEnter}
            onMouseDown={this.handleNoLift}
            className={styles.noLift}
          >
            <FormattedMessage id="lifting.button-no-lift" defaultMessage="No Lift" />
          </button>
          <button
            type="button"
            onMouseEnter={this.handleOnMouseEnter}
            onMouseDown={this.handleGoodLift}
            className={styles.goodLift}
          >
            <FormattedMessage id="lifting.button-good-lift" defaultMessage="Good Lift" />
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
    lifting: state.lifting,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLiftingGroup: (day: number, platform: number, flight: Flight, lift: Lift) =>
      dispatch(setLiftingGroup(day, platform, flight, lift)),
    overrideAttempt: (attempt: number) => dispatch(overrideAttempt(attempt)),
    overrideEntryId: (entryId: number) => dispatch(overrideEntryId(entryId)),
    markLift: (entryId: number, lift: Lift, attempt: number, success: boolean) =>
      dispatch(markLift(entryId, lift, attempt, success)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiftingFooter);
