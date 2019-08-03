// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// The confirmation modal that pops up when the "New Meet" button is clicked.

import React from "react";
import { connect } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { LinkContainer } from "react-router-bootstrap";

import { overwriteStore } from "../../actions/globalActions.js";
import rootReducer from "../../reducers/rootReducer.js";

import type { GlobalState } from "../../types/stateTypes.js";

interface OwnProps {
  show: boolean;
  close: () => void;
}

interface DispatchProps {
  overwriteStore: () => any;
}

type Props = OwnProps & DispatchProps;

class NewMeetModal extends React.Component<Props> {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Starting a new meet will remove all data from the current meet.</p>
          <p>Are you sure you want to continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <LinkContainer to="/meet-setup">
            <Button onClick={this.props.overwriteStore} variant="primary">
              Continue
            </Button>
          </LinkContainer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  const newGlobal: GlobalState = rootReducer({}, "OVERWRITE_STORE");

  return {
    overwriteStore: () => dispatch(overwriteStore(newGlobal))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(NewMeetModal);
