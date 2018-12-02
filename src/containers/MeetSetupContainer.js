// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";

import MeetSetup from "../components/meet-setup/MeetSetup";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class MeetSetupContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.meet.name}</h1>
        <MeetSetup />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetSetupContainer);
