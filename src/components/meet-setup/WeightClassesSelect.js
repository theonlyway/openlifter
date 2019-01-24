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
import CreatableSelect from "react-select/lib/Creatable";

import { setWeightClasses } from "../../actions/meetSetupActions";

const components = {
  DropdownIndicator: null
};

const createOption = label => ({
  label,
  value: label
});

class WeightClassesSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    let objarray = [];
    for (let i = 0; i < props.classes.length; i++) {
      const c = String(props.classes[i]);
      objarray.push({ value: c, label: c });
    }

    this.state = {
      inputValue: "",
      value: objarray
    };

    this.maybeUpdateRedux = this.maybeUpdateRedux.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Updates the Redux store if a weightclass was added or removed.
  // Since updates are synchronous, we can simply check length.
  maybeUpdateRedux(objarray) {
    // objarray is a list of {value: "foo", label: "foo"} objects.
    if (objarray.length === this.props.classes.length) {
      return;
    }

    // The classes changed: save to Redux.
    let classes = [];
    for (let i = 0; i < objarray.length; i++) {
      classes.push(Number(objarray[i].label));
    }
    this.props.setWeightClasses(this.props.sex, classes);
  }

  // Handles the case of deleting an existing weightclass.
  handleChange(value, actionMeta) {
    this.setState({ value });
    this.maybeUpdateRedux(value);
  }

  // Reflects the current typing status in the state.
  handleInputChange(inputValue) {
    this.setState({ inputValue });
  }

  // Handles the case of creating a new weightclass.
  handleKeyDown(event) {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      // Disallow creating redundant classes.
      for (let i = 0; i < value.length; i++) {
        if (value[i].label === inputValue) {
          // Silently drop the redundant weightclass.
          this.setState({ inputValue: "" });
          event.preventDefault();
          return;
        }
      }

      // Disallow creating non-numeric inputs.
      if (isNaN(Number(inputValue))) {
        this.setState({ inputValue: "" });
        event.preventDefault();
        return;
      }

      // Sort the new value into the array.
      let newValue = [...value, createOption(inputValue)];
      newValue = newValue.sort((a, b) => Number(a.value) - Number(b.value));

      this.setState({
        inputValue: "",
        value: newValue
      });
      this.maybeUpdateRedux(newValue);
      event.preventDefault();
    }
  }

  render() {
    const { inputValue, value } = this.state;
    return (
      <FormGroup>
        <ControlLabel>{this.props.label}</ControlLabel>
        <CreatableSelect
          components={components}
          inputValue={inputValue}
          isMulti
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Type a weight class and press Enter..."
          value={value}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const menClasses = state.meet.weightClassesKgMen;
  const womenClasses = state.meet.weightClassesKgWomen;
  const classes = ownProps.sex === "M" ? menClasses : womenClasses;

  return {
    classes: classes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setWeightClasses: (sex, classesKg) => dispatch(setWeightClasses(sex, classesKg))
  };
};

WeightClassesSelect.propTypes = {
  label: PropTypes.string.isRequired,
  sex: PropTypes.string.isRequired,
  classes: PropTypes.array.isRequired,
  setWeightClasses: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeightClassesSelect);
