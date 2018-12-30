// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setLengthDays } from "../../actions/meetSetupActions";

class MeetLength extends React.Component {
  constructor(props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: this.props.lengthDays
    };
  }

  getValidationState() {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber <= 0 || asNumber > 14) {
      return "error";
    }
    return "success";
  }

  handleChange(event) {
    const value = event.target.value;

    this.setState({ value: value }, () => {
      // As callback, save successful value into Redux store.
      if (this.getValidationState() !== "error") {
        this.props.setLengthDays(value);
      }
    });
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>Days of Lifting</ControlLabel>
        <FormControl type="number" value={this.state.value} onChange={this.handleChange} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  lengthDays: state.meet.lengthDays
});

const mapDispatchToProps = dispatch => {
  return {
    setLengthDays: days => dispatch(setLengthDays(days))
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
