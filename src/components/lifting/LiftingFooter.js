// vim: set ts=2 sts=2 sw=2 et:
//
// The footer of the Lifting page, contained by the LiftingView.
// This is the parent element of the controls that affect present lifting state.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, FormControl } from "react-bootstrap";

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

    const buttonStyle = {
      width: "200px",

      // Removing rounding allows the score table operator to mash "Good Lift"
      // by just moving the mouse into the lower-left corner of the screen.
      borderRadius: "0px"
    };
    const selectStyle = { width: "120px" };

    const rightControlsStyle = {
      display: "flex",
      alignItems: "center",
      paddingRight: "4px"
    };

    return (
      <div style={footerStyle}>
        <div>
          <Button bsStyle="success" bsSize="large" style={buttonStyle}>
            Good Lift
          </Button>
          <Button bsStyle="danger" bsSize="large" style={buttonStyle}>
            No Lift
          </Button>
        </div>

        <div style={rightControlsStyle}>
          <FormControl componentClass="select" style={selectStyle}>
            {this.dayOptions}
          </FormControl>
          <FormControl componentClass="select" style={selectStyle}>
            {platformOptions}
          </FormControl>
          <FormControl componentClass="select" style={selectStyle}>
            {liftOptions}
          </FormControl>
          <FormControl componentClass="select" style={selectStyle}>
            {flightOptions}
          </FormControl>
          <FormControl componentClass="select" style={selectStyle}>
            {attemptOptions}
          </FormControl>
          <FormControl componentClass="select" style={selectStyle}>
            <option key={0} value="5000">
              Unknown Lifter
            </option>
          </FormControl>
        </div>
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
