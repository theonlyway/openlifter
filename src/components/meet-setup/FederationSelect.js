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

// Defines the FederationSelect text input box with validation.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { setFederation } from "../../actions/meetSetupActions";

class FederationSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: this.props.federation
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
    this.props.setFederation(event.target.value);
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()}>
        <Form.Label>Federation</Form.Label>
        <FormControl
          type="text"
          placeholder="Federation"
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  federation: state.meet.federation
});

const mapDispatchToProps = dispatch => {
  return {
    setFederation: name => dispatch(setFederation(name))
  };
};

FederationSelect.propTypes = {
  federation: PropTypes.string.isRequired,
  setFederation: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FederationSelect);
