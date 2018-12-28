// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the MeetName text input box with validation.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import { setMeetName } from "../../actions/meetSetupActions";

class MeetName extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: this.props.name
    };
  }

  getValidationState() {
    const { value } = this.state;
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  }

  // When the control loses focus, possibly update the Redux store.
  handleBlur(e) {
    const value = e.target.value;

    // Render the component based on its internal state change.
    //
    // Because setState() is asynchronous, checking validation and
    // potentially updating the Redux store is handled in a callback.
    // Note that setState() is asynchronous, so "this.state" cannot be read.
    this.setState({ value: value }, () => {
      // If the change is successful, save the successful value into the Redux store.
      if (this.getValidationState() !== "error") {
        this.props.setMeetName(value);
      }
    });
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>Meet Name</ControlLabel>
        <FormControl type="text" placeholder="Meet Name" defaultValue={this.props.name} onBlur={this.handleBlur} />
        <FormControl.Feedback />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  name: state.meet.name
});

const mapDispatchToProps = dispatch => {
  return {
    setMeetName: name => dispatch(setMeetName(name))
  };
};

MeetName.propTypes = {
  name: PropTypes.string.isRequired,
  setMeetName: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetName);
