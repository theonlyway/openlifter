// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Results page.

import React from "react";
import { connect } from "react-redux";

import ResultsView from "../components/results/ResultsView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class ResultsContainer extends React.Component {
  render() {
    return (
      <div>
        <ResultsView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsContainer);
