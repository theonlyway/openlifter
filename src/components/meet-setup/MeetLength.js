// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setLengthDays } from "../../actions/meetSetupActions";

class MeetLength extends React.Component {
  render() {
    const { lengthDays } = this.props.meet;
    return (
      <FormGroup>
        <ControlLabel>Meet Length (Days)</ControlLabel>
        <div>
          <FormControl
            type="number"
            placeholder="Meet Length (Days)"
            defaultValue={lengthDays}
            onChange={this.props.setLengthDays}
          />
        </div>
      </FormGroup>
    );
  }
}

MeetLength.propTypes = {
  meet: PropTypes.shape({
    lengthDays: PropTypes.number.isRequired
  }).isRequired,
  setLengthDays: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setLengthDays: event => dispatch(setLengthDays(event.target.value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetLength);
