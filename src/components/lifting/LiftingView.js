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
  constructor(props) {
    super(props);
    this.getLiftingState = this.getLiftingState.bind(this);
  }

  // Main application logic. Reduces the Redux store to a local lifting state.
  getLiftingState() {}

  render() {
    return [<LiftingContent key={0} />, <LiftingFooter key={1} />];
  }
}

const mapStateToProps = state => {
  const day = state.lifting.day;
  const platform = state.lifting.platform;
  const flight = state.lifting.flight;

  // Only receive entries that are in the currently-lifting group.
  const entries = state.registration.entries.filter(
    entry => entry.day === day && entry.platform === platform && entry.flight === flight
  );

  return {
    meet: state.meet,
    entries: entries,
    lifting: state.lifting
  };
};

export default connect(
  mapStateToProps,
  null
)(LiftingView);
