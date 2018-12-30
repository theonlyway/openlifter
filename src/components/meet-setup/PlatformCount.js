// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setPlatformsOnDays } from "../../actions/meetSetupActions";

class PlatformCount extends React.Component {
  constructor(props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      value: this.props.platformsOnDays[this.props.day - 1]
    };
  }

  getValidationState() {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber <= 0) {
      return "error";
    }
    return "success";
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ value: value });
  }

  handleBlur(event) {
    if (this.getValidationState() !== "success") {
      return;
    }
    this.props.setPlatformsOnDays({ day: this.props.day, count: event.target.value });
  }

  render() {
    const { day } = this.props;
    const label = "Platforms on Day " + day;

    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl type="number" value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  platformsOnDays: state.meet.platformsOnDays
});

const mapDispatchToProps = dispatch => {
  return {
    setPlatformsOnDays: data => dispatch(setPlatformsOnDays(data))
  };
};

PlatformCount.propTypes = {
  platformsOnDays: PropTypes.array.isRequired,
  setPlatformsOnDays: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlatformCount);
