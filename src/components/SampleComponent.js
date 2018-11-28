// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import { sampleAction } from "../actions/sampleAction";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Allows react component to subscribe to redux state updates
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    sampleAction: text => dispatch(sampleAction(text))
  };
};

class SampleComponent extends React.Component {
  // Call the sample action with a hardcoded
  sayHello = event => {
    this.props.sampleAction("Hello world");
  };

  render() {
    // Result will be the string result from the reducer, which gets its payload from calls to sampleAction
    // Link allows us to go to another page, which will render a different component because of our Route defined in App.js
    const { result } = this.props.sampleReducer;
    return (
      <div>
        <button onClick={this.sayHello}>Say Hello</button>
        <Link to="/test">Go to second page</Link>
        <div>{result}</div>
      </div>
    );
  }
}

// Prop Types let us specify the type of the props given to the component.
// Specifying the prop types is a good practice and any missing ones will actually cause a linting failure.
SampleComponent.propTypes = {
  sampleAction: PropTypes.func,
  sampleReducer: PropTypes.shape({
    result: PropTypes.string
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleComponent);
