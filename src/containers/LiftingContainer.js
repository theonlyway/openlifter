// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Lifting page.

import React from "react";
import { connect } from "react-redux";

import LiftingContent from "../components/lifting/LiftingContent";
import LiftingFooter from "../components/lifting/LiftingFooter";

class LiftingContainer extends React.Component {
  render() {
    return [<LiftingContent key={0} />, <LiftingFooter key={1} />];
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftingContainer);
