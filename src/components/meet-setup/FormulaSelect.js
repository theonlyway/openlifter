// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Select from "react-select";

import { setFormula } from "../../actions/meetSetupActions";

const options = [
  { value: "Glossbrenner", label: "Glossbrenner" },
  { value: "Wilks", label: "Wilks" }
];

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setFormula: item => dispatch(setFormula(item.value))
  }
};

class FormulaSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The "value" property expects an object instead of a string.
    this.valueObject = options.find(option => {
      return option.value === this.props.meet.formula;
    });
  }

  render() {
    return (
      <Select defaultValue={this.valueObject} onChange={this.props.setFormula} options={options} />
    );
  }
}

FormulaSelect.propTypes = {
  setFormula: PropTypes.func,
  meet: PropTypes.shape({
    formula: PropTypes.string
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormulaSelect);
