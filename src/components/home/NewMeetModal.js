// vim: set ts=2 sts=2 sw=2 et:
//
// The confirmation modal that will popup when the user goes to click New Meet on the home page
// TODO: The Continue button should actually wipe out the current meet information

import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";

class NewMeetModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to create a New Meet? This will delete any existing progress!</p>
        </Modal.Body>
        <Modal.Footer>
          <LinkContainer to="/meet-setup">
            <Button bsStyle="primary">Continue</Button>
          </LinkContainer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NewMeetModal.defaultProps = {
  show: false
};

NewMeetModal.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func.isRequired
};

export default NewMeetModal;
