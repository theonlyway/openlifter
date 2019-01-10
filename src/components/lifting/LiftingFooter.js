// vim: set ts=2 sts=2 sw=2 et:
//
// The footer of the Lifting page, contained by the LiftingView.
// This is the parent element of the controls that affect present lifting state.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, FormControl } from "react-bootstrap";

import { markLift, overrideAttempt, overrideEntryId, setLiftingGroup } from "../../actions/liftingActions";

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  backgroundColor: "#f8f8f8",
  borderTop: "1px solid #e7e7e7"
};

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

const flightOptions = [
  <option key={"A"} value={"A"}>
    Flight A
  </option>,
  <option key={"B"} value={"B"}>
    Flight B
  </option>,
  <option key={"C"} value={"C"}>
    Flight C
  </option>,
  <option key={"D"} value={"D"}>
    Flight D
  </option>,
  <option key={"E"} value={"E"}>
    Flight E
  </option>,
  <option key={"F"} value={"F"}>
    Flight F
  </option>,
  <option key={"G"} value={"G"}>
    Flight G
  </option>,
  <option key={"H"} value={"H"}>
    Flight H
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

class LiftingFooter extends React.Component {
  constructor(props) {
    super(props);

    this.dayOptions = [];
    for (let i = 1; i <= props.lengthDays; i++) {
      const label = "Day " + String(i);
      this.dayOptions.push(
        <option value={i} key={i}>
          {label}
        </option>
      );
    }

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

  handleDayChange(event) {
    const day = Number(event.target.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;

    // If the new day has fewer platforms, reset the platform selector also.
    let platform = this.props.lifting.platform;
    if (platform > this.props.platformsOnDays[day - 1]) {
      platform = 1;
    }

    this.props.setLiftingGroup(day, platform, flight, lift);
  }
  handlePlatformChange(event) {
    const day = this.props.lifting.day;
    const platform = Number(event.target.value);
    const flight = this.props.lifting.flight;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  }
  handleFlightChange(event) {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = event.target.value;
    const lift = this.props.lifting.lift;
    this.props.setLiftingGroup(day, platform, flight, lift);
  }
  handleLiftChange(event) {
    const day = this.props.lifting.day;
    const platform = this.props.lifting.platform;
    const flight = this.props.lifting.flight;
    const lift = event.target.value;
    this.props.setLiftingGroup(day, platform, flight, lift);
  }

  handleAttemptChange(event) {
    const attempt = Number(event.target.value);
    this.props.overrideAttempt(attempt);
  }
  handleLifterChange(event) {
    const entryId = Number(event.target.value);
    this.props.overrideEntryId(entryId);
  }

  handleGoodLift() {
    // If there's no active entry, there's nothing to set.
    if (this.props.currentEntryId === null) {
      return;
    }

    const entryId = Number(this.props.currentEntryId);
    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    this.props.markLift(entryId, lift, attempt, true);
  }

  handleNoLift() {
    // If there's no active entry, there's nothing to set.
    if (this.props.currentEntryId === null) {
      return;
    }

    const entryId = Number(this.props.currentEntryId);
    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    this.props.markLift(entryId, lift, attempt, false);
  }

  handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const liftingView = document.getElementById("liftingView");
      liftingView.requestFullscreen();
    }
  }

  makeLifterOptions() {
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
  }

  render() {
    const numPlatforms = this.props.platformsOnDays[this.props.lifting.day - 1];

    let platformOptions = [];
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          Platform {i}
        </option>
      );
    }

    const buttonStyle = {
      width: "200px",

      // Removing rounding allows the score table operator to mash "Good Lift"
      // by just moving the mouse into the lower-left corner of the screen.
      borderRadius: "0px"
    };
    const selectStyle = { width: "110px" };

    const rightControlsStyle = {
      display: "flex",
      alignItems: "center",
      paddingRight: "4px"
    };

    const currentEntryId = this.props.currentEntryId === null ? undefined : this.props.currentEntryId;

    return (
      <div style={footerStyle}>
        <div>
          <Button onClick={this.handleGoodLift} bsStyle="success" bsSize="large" style={buttonStyle}>
            Good Lift
          </Button>
          <Button onClick={this.handleNoLift} bsStyle="danger" bsSize="large" style={buttonStyle}>
            No Lift
          </Button>
          <Button onClick={this.handleFullscreen} style={{ marginLeft: "7px" }} bsStyle="info">
            Toggle Fullscreen
          </Button>
        </div>

        <div style={rightControlsStyle}>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.day}
            onChange={this.handleDayChange}
            style={selectStyle}
          >
            {this.dayOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.platform}
            onChange={this.handlePlatformChange}
            style={selectStyle}
          >
            {platformOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.lift}
            onChange={this.handleLiftChange}
            style={selectStyle}
          >
            {liftOptions}
          </FormControl>
          <FormControl
            componentClass="select"
            defaultValue={this.props.lifting.flight}
            onChange={this.handleFlightChange}
            style={selectStyle}
          >
            {flightOptions}
          </FormControl>
          <FormControl
            value={this.props.attemptOneIndexed}
            componentClass="select"
            onChange={this.handleAttemptChange}
            style={selectStyle}
          >
            {attemptOptions}
          </FormControl>
          <FormControl
            value={currentEntryId}
            componentClass="select"
            onChange={this.handleLifterChange}
            style={selectStyle}
          >
            {this.makeLifterOptions()}
          </FormControl>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lengthDays: state.meet.lengthDays,
    platformsOnDays: state.meet.platformsOnDays,
    lifting: state.lifting
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLiftingGroup: (day, platform, flight, lift) => dispatch(setLiftingGroup(day, platform, flight, lift)),
    overrideAttempt: attempt => dispatch(overrideAttempt(attempt)),
    overrideEntryId: entryId => dispatch(overrideEntryId(entryId)),
    markLift: (entryId, lift, attempt, success) => dispatch(markLift(entryId, lift, attempt, success))
  };
};

LiftingFooter.propTypes = {
  // Props calculated by the LiftingView.
  attemptOneIndexed: PropTypes.number.isRequired,
  orderedEntries: PropTypes.array.isRequired,
  currentEntryId: PropTypes.number, // Can be null.

  // Props passed from Redux state.
  lengthDays: PropTypes.number.isRequired,
  platformsOnDays: PropTypes.array.isRequired,
  lifting: PropTypes.shape({
    day: PropTypes.number.isRequired,
    platform: PropTypes.number.isRequired,
    flight: PropTypes.string.isRequired,
    lift: PropTypes.string.isRequired
  }).isRequired,
  markLift: PropTypes.func.isRequired,
  setLiftingGroup: PropTypes.func.isRequired,
  overrideAttempt: PropTypes.func.isRequired,
  overrideEntryId: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftingFooter);
