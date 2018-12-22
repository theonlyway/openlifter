// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Weighins page.

import React from "react";
import { connect } from "react-redux";

import WeighinsView from "../components/weighins/WeighinsView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class WeighinsContainer extends React.Component {
  render() {
    return (
      <div>
        <WeighinsView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeighinsContainer);
