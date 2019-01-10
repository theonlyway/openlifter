// vim: set ts=2 sts=2 sw=2 et:
//
// An editable component for attempt manipulation in the LiftingContent.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { FormControl, FormGroup } from "react-bootstrap";

import { enterAttempt } from "../../actions/liftingActions";

import styles from "./LiftingTable.module.scss";

class AttemptInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    let weightStr = "";
    if (this.props.weightKg !== 0) {
      weightStr = String(this.props.weightKg);
    }

    this.state = {
      value: weightStr
    };
  }

  getValidationState() {
    const { value } = this.state;

    if (value === "") return null;

    const asNumber = Number(value);
    if (isNaN(asNumber)) return "error";
    if (asNumber % 2.5 !== 0) return "warning";
    return null;
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ value: value });
  }

  handleBlur(event) {
    if (this.getValidationState() === "error") {
      return;
    }

    const entryId = this.props.entryId;
    const lift = this.props.lift;
    const attemptOneIndexed = this.props.attemptOneIndexed;
    const weightKg = Number(this.state.value);

    this.props.enterAttempt(entryId, lift, attemptOneIndexed, weightKg);
  }

  render() {
    return (
      <FormGroup validationState={this.getValidationState()} style={{ marginBottom: 0 }}>
        <FormControl
          type="text"
          placeholder=""
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          className={styles.attemptInput}
        />
      </FormGroup>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
  };
};

AttemptInput.propTypes = {
  entryId: PropTypes.number.isRequired,
  lift: PropTypes.string.isRequired,
  attemptOneIndexed: PropTypes.number.isRequired,
  weightKg: PropTypes.number.isRequired,
  enterAttempt: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(AttemptInput);
