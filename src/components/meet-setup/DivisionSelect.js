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

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setDivisions: item => dispatch(setDivisions(item.value))
  };
};

class DivisionSelect extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inputValue: "",
      value: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(value, actionMeta) {
    this.setState({ value });
  }
  handleInputChange(inputValue) {
    this.setState({ inputValue });
  }
  handleKeyDown(event) {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      this.setState({
        inputValue: "",
        value: [...value, createOption(inputValue)]
      });
      event.preventDefault();
    }
  }

  render() {
    const { inputValue, value } = this.state;
    return (
      <FormGroup>
        <ControlLabel>Divisions</ControlLabel>
        <CreatableSelect
          components={components}
          inputValue={inputValue}
          isMulti
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          // defaultValue={this.valueObject}
          placeholder="Type a division and press Enter..."
          value={value}
        />
      </FormGroup>
    );
  }
}

DivisionSelect.propTypes = {
  setDivision: PropTypes.func,
  meet: PropTypes.shape({
    federation: PropTypes.string
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DivisionSelect);
