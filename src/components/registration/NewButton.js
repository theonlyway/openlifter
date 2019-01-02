// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the button that adds a new entry to the registrations table.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { newRegistration } from "../../actions/registrationActions";

class NewButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.newRegistration({});
  }

  render() {
    return (
      <Button onClick={this.handleClick} bsStyle="primary" bsSize="large" block>
        New Lifter
      </Button>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    newRegistration: obj => dispatch(newRegistration(obj))
  };
};

NewButton.propTypes = {
  newRegistration: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewButton);
