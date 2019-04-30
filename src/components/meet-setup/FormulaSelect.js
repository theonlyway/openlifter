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

import { setFormula } from "../../actions/meetSetupActions";

const options = [
  { value: "Glossbrenner", label: "Glossbrenner" },
  { value: "IPF Points", label: "IPF Points" },
  { value: "NASA Points", label: "NASA Points" },
  { value: "Schwartz/Malone", label: "Schwartz/Malone" },
  { value: "Wilks", label: "Wilks" }
];

class FormulaSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The "value" property expects an object instead of a string.
    this.valueObject = options.find(option => {
      return option.value === this.props.formula;
    });
  }

  render() {
    return (
      <FormGroup validationState="success">
        <ControlLabel>Best Lifter Formula</ControlLabel>
        <Select defaultValue={this.valueObject} onChange={this.props.setFormula} options={options} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  formula: state.meet.formula
});

const mapDispatchToProps = dispatch => {
  return {
    setFormula: item => dispatch(setFormula(item.value))
  };
};

FormulaSelect.propTypes = {
  formula: PropTypes.string.isRequired,
  setFormula: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormulaSelect);
