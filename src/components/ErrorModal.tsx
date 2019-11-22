// vim: set ts=2 sts=2 sw=2 et:
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

// Shows a popup with an error message.
// This exists because Chrome only allows window.alert() to execute once,
// because Chrome is bad and Google should feel bad.
//
// This is intended only for use with buttons that load external resources,
// like save files and CSV registration importation files.
//
// Regular old errors in widgets should be reported by setting their
// validationState.

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface OwnProps {
  error: string;
  title: string;
  show: boolean;
  close: () => void;
}

type Props = OwnProps;

class ErrorModal extends React.Component<Props> {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{this.props.error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={this.props.close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(null, null)(ErrorModal);
