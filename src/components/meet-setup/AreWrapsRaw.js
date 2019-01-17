// vim: set ts=2 sts=2 sw=2 et:

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
