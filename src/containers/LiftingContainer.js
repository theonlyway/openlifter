// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Lifting page.

import React from "react";
import { connect } from "react-redux";

import LiftingView from "../components/lifting/LiftingView";

class LiftingContainer extends React.Component {
  render() {
    return <LiftingView />;
  }
}

export default connect(
  null,
  null
)(LiftingContainer);
