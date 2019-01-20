// vim: set ts=2 sts=2 sw=2 et:
// @flow

import React from "react";
import { connect } from "react-redux";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setBarAndCollarsWeightKg } from "../../actions/meetSetupActions";

type Props = {
  inKg: boolean,
  barAndCollarsWeightKg: number,
  setBarAndCollarsWeightKg: number => any
};

type State = {
  value: number
};

class BarAndCollarsWeightKg extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const weight = this.props.barAndCollarsWeightKg;
    const value = this.props.inKg ? weight : weight * 2.20462262;

    this.state = {
      value: value
    };
  }

  getValidationState = () => {
    const { value } = this.state;
    const asNumber = Number(value);

    if (isNaN(asNumber) || asNumber <= 0 || asNumber < 5) {
      return "error";
    }
    return "success";
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState({ value: value }, () => {
      if (this.getValidationState() === "success") {
        const asNum = Number(value);
        const weight = this.props.inKg ? asNum : asNum / 2.20462262;
        this.props.setBarAndCollarsWeightKg(weight);
      }
    });
  };

  render() {
    const label = "Bar + Collars weight (" + (this.props.inKg ? "kg" : "lbs") + ")";

    return (
      <FormGroup validationState={this.getValidationState()}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl type="number" value={this.state.value} onChange={this.handleChange} />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  inKg: state.meet.inKg,
  barAndCollarsWeightKg: state.meet.barAndCollarsWeightKg
});

const mapDispatchToProps = dispatch => {
  return {
    setBarAndCollarsWeightKg: weightKg => dispatch(setBarAndCollarsWeightKg(weightKg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarAndCollarsWeightKg);
