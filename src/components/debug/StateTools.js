// vim: set ts=2 sts=2 sw=2 et:
//
// Tools for manipulating state information to aid debugging.

import React from "react";
import { connect } from "react-redux";
import { ButtonGroup, Panel } from "react-bootstrap";

import RandomizeMeetSetupButton from "./RandomizeMeetSetup";

class StateTools extends React.Component {
  render() {
    return (
      <div>
        <Panel bsStyle="danger">
          <Panel.Heading>Generate Random Data</Panel.Heading>
          <Panel.Body>
            <ButtonGroup>
              <RandomizeMeetSetupButton />
            </ButtonGroup>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>Redux State</Panel.Heading>
          <Panel.Body>
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(StateTools);
