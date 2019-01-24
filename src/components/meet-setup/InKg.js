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

import { setInKg } from "../../actions/meetSetupActions";

const options = [{ value: true, label: "Kilograms" }, { value: false, label: "Pounds" }];

class InKg extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The "value" property expects an object instead of a string.
    this.valueObject = options.find(option => {
      return option.value === this.props.inKg;
    });
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>In what units are attempts and bodyweights?</ControlLabel>
        <Select defaultValue={this.valueObject} onChange={this.props.setInKg} options={options} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  inKg: state.meet.inKg
});

const mapDispatchToProps = dispatch => {
  return {
    setInKg: item => dispatch(setInKg(item.value))
  };
};

InKg.propTypes = {
  inKg: PropTypes.bool.isRequired,
  setInKg: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InKg);
