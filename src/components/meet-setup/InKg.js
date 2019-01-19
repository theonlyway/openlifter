// vim: set ts=2 sts=2 sw=2 et:

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
