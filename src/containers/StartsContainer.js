// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Starts page.

import React from "react";
import { connect } from "react-redux";

import StartsView from "../components/starts/StartsView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class StartsContainer extends React.Component {
  render() {
    return (
      <div>
        <StartsView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartsContainer);
