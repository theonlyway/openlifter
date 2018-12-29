// vim: set ts=2 sts=2 sw=2 et:
//
// Defines an input of a single weight, during configuration.
// Since it's for configuration, it doesn't have an associated success/failure value.
//
// For consistency purposes, weights are always stored in kg.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormControl, FormGroup } from "react-bootstrap";

import { updateRegistration } from "../../actions/registrationActions";

class WeightInput extends React.Component {
  constructor(props) {
    super(props);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    let weight = this.props.weightKg;
    if (!this.props.inKg) {
      weight = weight * 2.20462262;
    }

    // Prefer displaying an empty string to 0.0.
    if (weight === 0.0) {
      weight = "";
    }

    // Internal state, for purposes of validation.
    // To avoid confusion (auto-rounding) when typing, just store a String.
    this.state = {
      weightStr: String(weight)
    };
  }

  getValidationState() {
    const weightNum = Number(this.state.weightStr);
    if (isNaN(weightNum) || weightNum < 0) {
      return "error";
    } else if (this.state.weightStr.length > 0) {
      return "success";
    }
    return null;
  }

  // Update the internal state, used for validation.
  handleChange(event) {
    const weightStr = event.target.value;
    this.setState({ weightStr: weightStr });
  }

  // Update the Redux store.
  handleBlur(event) {
    const weightStr = event.target.value;
    const weightNum = Number(weightStr);

    if (this.getValidationState() === "error") {
      return;
    }

    const weightKg = this.props.inKg ? weightNum : weightNum / 2.20462262;

    if (this.props.weightKg !== weightKg) {
      let newfields = {};
      newfields[this.props.field] = weightKg;
      this.props.updateRegistration(this.props.id, newfields);
    }
  }

  render() {
    // FormGroup provides a default padding of 15, but FormGroup is only being
    // used here to accept a validationState. It's not really a group.
    const undoDefaultPadding = { marginBottom: "0" };

    return (
      <FormGroup style={undoDefaultPadding} validationState={this.getValidationState()}>
        <FormControl
          disabled={this.props.disabled}
          type="text"
          value={this.state.weightStr}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];
  const field = ownProps.field;

  return {
    inKg: state.meet.inKg,
    weightKg: entry[field]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

WeightInput.propTypes = {
  // The EntryID.
  id: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  inKg: PropTypes.bool.isRequired,
  weightKg: PropTypes.number.isRequired,
  // The name of the field on the entry, like "bodyweightKg".
  field: PropTypes.string.isRequired,
  updateRegistration: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeightInput);
