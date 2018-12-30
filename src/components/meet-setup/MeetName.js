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

    this.handleChange = this.handleChange.bind(this);
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

  handleChange(event) {
    const value = event.target.value;
    this.setState({ value: value });
  }

  // When the control loses focus, possibly update the Redux store.
  handleBlur(event) {
    if (this.getValidationState() !== "success") {
      return;
    }
    this.props.setMeetName(event.target.value);
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>Meet Name</ControlLabel>
        <FormControl
          type="text"
          placeholder="Meet Name"
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
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
