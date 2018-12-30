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
    console.log(this.dayOptions);
    return (
      <div style={footerStyle}>
        <Button>Good Lift</Button>
        <Button>No Lift</Button>

        <FormControl componentClass="select">{this.dayOptions}</FormControl>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lengthDays: state.meet.lengthDays
  };
};

LiftingFooter.propTypes = {
  lengthDays: PropTypes.number
};

export default connect(
  mapStateToProps,
  null
)(LiftingFooter);
