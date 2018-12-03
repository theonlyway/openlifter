// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Lifting page.

import React from "react";
import { connect } from "react-redux";

import LiftingView from "../components/lifting/LiftingView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class LiftingContainer extends React.Component {
  render() {
    return (
      <div>
        <LiftingView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftingContainer);
