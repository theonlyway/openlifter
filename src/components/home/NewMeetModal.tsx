// vim: set ts=2 sts=2 sw=2 et:
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

import { overwriteStore } from "../../actions/globalActions";
import rootReducer from "../../reducers/rootReducer";

import { GlobalState } from "../../types/stateTypes";
import { Dispatch } from "redux";

interface OwnProps {
  show: boolean;
  close: () => void;
}

interface StateProps {
  name: string;
}

interface DispatchProps {
  overwriteStore: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class NewMeetModal extends React.Component<Props> {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>OK to clear {this.props.name}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Starting a new meet will clear all unsaved data from {this.props.name}.</p>
          <p>Are you sure you want to continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close} variant="light">
            Close
          </Button>
          <LinkContainer to="/meet-setup">
            <Button onClick={this.props.overwriteStore} variant="primary">
              Continue
            </Button>
          </LinkContainer>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    name: state.meet.name
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    overwriteStore: () => {
      // Calling the combined root reducer with an empty object results in the child reducers
      // being invoked with no argument, so they return their default states.
      // We cast here since this is not how the reducer is really intended to work
      const defaultStore = rootReducer({} as GlobalState, "OVERWRITE_STORE" as any);
      dispatch(overwriteStore(defaultStore));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewMeetModal);
