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
        <Button>Good Lift</Button>
        <Button>No Lift</Button>

        <FormControl componentClass="select">{this.dayOptions}</FormControl>
        <FormControl componentClass="select">{platformOptions}</FormControl>
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
