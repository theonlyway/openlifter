// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup } from "react-bootstrap";
import CreatableSelect from "react-select/lib/Creatable";

import { setDivisions } from "../../actions/meetSetupActions";

const components = {
  DropdownIndicator: null
};

const createOption = label => ({
  label,
  value: label
});

class DivisionSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    let objarray = [];
    for (let i = 0; i < props.divisions.length; i++) {
      const division = props.divisions[i];
      objarray.push({ value: division, label: division });
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

  // Updates the Redux store if a division was added or removed.
  // Since updates are synchronous, we can simply check length.
  maybeUpdateRedux(objarray) {
    // objarray is a list of {value: "foo", label: "foo"} objects.
    if (objarray.length === this.props.divisions.length) {
      return;
    }

    // The divisions changed: save to Redux.
    let divisions = [];
    for (let i = 0; i < objarray.length; i++) {
      divisions.push(objarray[i].label);
    }
    this.props.setDivisions(divisions);
  }

  // Handles the case of deleting an existing division.
  handleChange(value, actionMeta) {
    this.setState({ value });
    this.maybeUpdateRedux(value);
  }

  // Reflects the current typing status in the state.
  handleInputChange(inputValue) {
    this.setState({ inputValue });
  }

  // Handles the case of creating a new division.
  handleKeyDown(event) {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      // Disallow creating redundant divisions.
      for (let i = 0; i < value.length; i++) {
        if (value[i].label === inputValue) {
          // Silently drop the redundant division.
          this.setState({ inputValue: "" });
          event.preventDefault();
          return;
        }
      }

      const newValue = [...value, createOption(inputValue)];
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
        <ControlLabel>Divisions (prefer short codes!)</ControlLabel>
        <CreatableSelect
          components={components}
          inputValue={inputValue}
          isMulti
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Type a division and press Enter..."
          value={value}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  divisions: state.meet.divisions
});

const mapDispatchToProps = dispatch => {
  return {
    setDivisions: divisions => dispatch(setDivisions(divisions))
  };
};

DivisionSelect.propTypes = {
  divisions: PropTypes.array.isRequired,
  setDivisions: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DivisionSelect);
