// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the FlightOrder page.

import React from "react";
import { connect } from "react-redux";

import FlightOrderView from "../components/flight-order/FlightOrderView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class FlightOrderContainer extends React.Component {
  render() {
    return (
      <div>
        <FlightOrderView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightOrderContainer);
