// vim: set ts=2 sts=2 sw=2 et:
//
// Tools for manipulating state information to aid debugging.

import React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class StateTools extends React.Component {
  render() {
    return (
      <Panel bsStyle="info">
        <Panel.Heading>Redux State</Panel.Heading>
        <Panel.Body>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </Panel.Body>
      </Panel>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StateTools);
