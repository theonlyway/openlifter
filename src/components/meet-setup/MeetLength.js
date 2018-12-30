// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setLengthDays } from "../../actions/meetSetupActions";

class MeetLength extends React.Component {
  render() {
    return (
      <FormGroup>
        <ControlLabel>Days of Lifting</ControlLabel>
        <div>
          <FormControl
            type="number"
            defaultValue={this.props.lengthDays}
            onChange={this.props.setLengthDays}
          />
        </div>
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  lengthDays: state.meet.lengthDays
});

const mapDispatchToProps = dispatch => {
  return {
    setLengthDays: event => dispatch(setLengthDays(event.target.value))
  };
};

MeetLength.propTypes = {
  lengthDays: PropTypes.number.isRequired,
  setLengthDays: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetLength);
