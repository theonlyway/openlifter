// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the MeetName text input box with validation.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import { setMeetName } from "../../actions/meetSetupActions";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setMeetName: name => dispatch(setMeetName(name))
  };
};

class MeetName extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: this.props.meet.name
    };
  }

  getValidationState() {
    let value = this.state.value;
    if (value === "") return "warning";
    if (value.includes('"')) return "error";
    return "success";
  }

  // When the control loses focus, possibly update the Redux store.
  handleBlur(e) {
    const value = e.target.value;

    // Render the component based on its internal state change.
    this.setState({ value: value });

    // If the change is successful, save the successful value into the Redux store.
    if (this.getValidationState() !== "error") {
      this.props.setMeetName(e.target.value);
    }
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>Meet Name</ControlLabel>
        <FormControl type="text" placeholder="Meet Name" defaultValue={this.props.meet.name} onBlur={this.handleBlur} />
        <FormControl.Feedback />
      </FormGroup>
    );
  }
}

// Verifies the shape of the "props" given the component.
MeetName.propTypes = {
  meet: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  setMeetName: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetName);
