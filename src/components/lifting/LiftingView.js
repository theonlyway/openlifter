// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Lifting page, contained by the LiftingContainer.
//
// The LiftingContent, LiftingFooter, etc. all share calculated state.
// This class performs the state calculations and communicates that to its
// sub-components via props.
//

import React from "react";
import { connect } from "react-redux";

import LiftingContent from "./LiftingContent";
import LiftingFooter from "./LiftingFooter";

class LiftingView extends React.Component {
  render() {
    return [<LiftingContent key={0} />, <LiftingFooter key={1} />];
  }
};

export default connect(
  null,
  null
)(LiftingView);
