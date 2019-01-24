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

import { ControlLabel, FormGroup } from "react-bootstrap";
import Select from "react-select";

import { setAreWrapsRaw } from "../../actions/meetSetupActions";

const options = [{ value: true, label: "Yes" }, { value: false, label: "No" }];

class AreWrapsRaw extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The "value" property expects an object instead of a string.
    this.valueObject = options.find(option => {
      return option.value === this.props.value;
    });
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Should Raw and Wraps be combined for placing?</ControlLabel>
        <Select defaultValue={this.valueObject} onChange={this.props.setAreWrapsRaw} options={options} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  value: state.meet.areWrapsRaw
});

const mapDispatchToProps = dispatch => {
  return {
    setAreWrapsRaw: item => dispatch(setAreWrapsRaw(item.value))
  };
};

AreWrapsRaw.propTypes = {
  value: PropTypes.bool.isRequired,
  setAreWrapsRaw: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AreWrapsRaw);
