// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
        <FormControl
          type="text"
          pattern="[0-9]+"
          min="0"
          step="1"
          value={this.state.value}
          onChange={this.handleChange}
        />
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
