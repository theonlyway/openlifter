// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup } from "react-bootstrap";
import Select from "react-select";

import { setFormula } from "../../actions/meetSetupActions";

const options = [
  { value: "Glossbrenner", label: "Glossbrenner" },
  { value: "IPF Points", label: "IPF Points" },
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
