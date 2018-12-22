// vim: set ts=2 sts=2 sw=2 et:
//
// Container for the Registration page.

import React from "react";
import { connect } from "react-redux";

import RegistrationView from "../components/registration/RegistrationView";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class RegistrationContainer extends React.Component {
  render() {
    return (
      <div>
        <RegistrationView />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationContainer);
