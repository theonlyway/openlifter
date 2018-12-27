// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PlatformCount from "./PlatformCount";

class PlatformCounts extends React.Component {
  constructor(props) {
    super(props);
    this.createPlatformInputs = this.createPlatformInputs.bind(this);
  }

  createPlatformInputs() {
    let inputs = [];
    const { lengthDays } = this.props.meet;
    for (let i = 1; i <= lengthDays; i++) {
      inputs.push(<PlatformCount key={i} day={i} />);
    }
    return inputs;
  }
  render() {
    return <div>{this.createPlatformInputs()}</div>;
  }
}

PlatformCounts.propTypes = {
  meet: PropTypes.shape({
    lengthDays: PropTypes.number.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  ...state
});
export default connect(
  mapStateToProps,
  null
)(PlatformCounts);
