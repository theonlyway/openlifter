// vim: set ts=2 sts=2 sw=2 et:

import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
import { sampleAction } from "./actions/sampleAction";

// Allows react component to subscribe to redux state updates
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    sampleAction: text => dispatch(sampleAction(text))
  };
};

class App extends Component {
  sampleAction = event => {
    this.props.sampleAction("Hello world");
  };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props)}</pre>
        <button onClick={this.sampleAction}>Testing Redux</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
