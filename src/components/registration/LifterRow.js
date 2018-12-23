// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Registration page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { deleteRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor() {
    super();
    this.deleteRegistrationClick = this.deleteRegistrationClick.bind(this);
  }

  deleteRegistrationClick(event) {
    this.props.deleteRegistration(this.props.id);
  }

  render() {
    return (
      <div>
        Row {this.props.id}
        <Button onClick={this.deleteRegistrationClick} bsStyle="danger">
          Delete
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    deleteRegistration: entryId => dispatch(deleteRegistration(entryId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
