// vim: set ts=2 sts=2 sw=2 et:
//
// The footer of the Lifting page, contained by the LiftingContainer.
// This is the parent element of the controls that affect present lifting state.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, FormControl } from "react-bootstrap";

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%"
};

const liftOptions = [
  <option key={0} value={"S"}>
    Squat
  </option>,
  <option key={1} value={"B"}>
    Bench
  </option>,
  <option key={2} value={"D"}>
    Deadlift
  </option>
];

const flightOptions = [
  <option key={0} value={"A"}>
    Flight A
  </option>,
  <option key={1} value={"B"}>
    Flight B
  </option>,
  <option key={2} value={"C"}>
    Flight C
  </option>,
  <option key={3} value={"D"}>
    Flight D
  </option>,
  <option key={4} value={"E"}>
    Flight E
  </option>,
  <option key={5} value={"F"}>
    Flight F
  </option>,
  <option key={6} value={"G"}>
    Flight G
  </option>,
  <option key={7} value={"H"}>
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
  }

  render() {
    const CURRENT_DAY_FIXME = 1;
    const numPlatforms = this.props.platformsOnDays[CURRENT_DAY_FIXME - 1];

    let platformOptions = [];
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          Platform {i}
        </option>
      );
    }

    return (
      <div style={footerStyle}>
        <Button bsStyle="success">Good Lift</Button>
        <Button bsStyle="danger">No Lift</Button>

        <FormControl componentClass="select">{this.dayOptions}</FormControl>
        <FormControl componentClass="select">{platformOptions}</FormControl>
        <FormControl componentClass="select">{liftOptions}</FormControl>
        <FormControl componentClass="select">{flightOptions}</FormControl>
        <FormControl componentClass="select">{attemptOptions}</FormControl>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lengthDays: state.meet.lengthDays,
    platformsOnDays: state.meet.platformsOnDays
  };
};

LiftingFooter.propTypes = {
  lengthDays: PropTypes.number.isRequired,
  platformsOnDays: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingFooter);
