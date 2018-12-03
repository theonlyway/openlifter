// vim: set ts=2 sts=2 sw=2 et:
//
// Tools for manipulating state information to aid debugging.

import React from "react";
import { connect } from "react-redux";
import { Button, Panel } from "react-bootstrap";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {};
};

class StateTools extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.showState = this.showState.bind(this);
  }

  showState() {
    const propstr = JSON.stringify(this.props);
    console.log(propstr);
    window.alert(propstr);
  }

  render() {
    return (
      <Panel bsStyle="primary">
        <Panel.Heading>Redux State Tools</Panel.Heading>
        <Panel.Body>
          <Button bsStyle="info" onClick={this.showState}>
            Show State
          </Button>
        </Panel.Body>
      </Panel>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StateTools);
