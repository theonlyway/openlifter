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

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LinkContainer } from "react-router-bootstrap";

import saveAs from "file-saver";

// import LanguageSelector from "../components/translations/LanguageSelector";
import { overwriteStore } from "../actions/globalActions";

import NewMeetModal from "../components/home/NewMeetModal";
import ErrorModal from "../components/ErrorModal";

import { stateVersion, releaseVersion, releaseDate } from "../versions";

import type { GlobalState } from "../types/stateTypes";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 700, margin: "0 auto 10px" };

interface StateProps {
  redux: GlobalState;
}

interface DispatchProps {
  overwriteStore: (store: GlobalState) => void;
}

interface InternalState {
  showNewMeetModal: boolean;
  // Controls the ErrorModal popup. Shown when error !== "".
  error: string;
}

type Props = StateProps & DispatchProps;

class HomeContainer extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleNewClick = this.handleNewClick.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.renderContinueButton = this.renderContinueButton.bind(this);

    this.state = { showNewMeetModal: false, error: "" };
  }

  // The file input is hidden, and we want to use a button to activate it.
  // This event handler is just a proxy to call the *real* event handler.
  handleLoadClick = () => {
    const loadhelper = document.getElementById("loadhelper");
    if (loadhelper !== null) {
      loadhelper.click();
    }
  };

  // When we click the new meet button
  // Open the popover modal to confirm the user is willing to delete any current progress
  handleNewClick = () => {
    this.setState({ showNewMeetModal: true });
  };

  // Close the new meet confirmation modal
  closeConfirmModal = () => {
    this.setState({ showNewMeetModal: false });
  };

  closeErrorModal = () => {
    this.setState({ error: "" });
  };

  // Called when a file is selected.
  handleLoadFileInput = () => {
    // Load the element and make sure it's an HTMLInputElement.
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement)) {
      return;
    }

    const selectedFile = loadHelper.files[0];
    let rememberThis = this;

    let reader = new FileReader();
    reader.onload = function(event) {
      let errored = false;
      try {
        let obj = JSON.parse(event.target.result);

        // Basic error checking, make sure it's the right format.
        if (
          obj.language === undefined ||
          obj.meet === undefined ||
          obj.registration === undefined ||
          obj.lifting === undefined
        ) {
          errored = true;
        } else {
          rememberThis.props.overwriteStore(obj);
        }
      } catch (err) {
        errored = true;
      }

      if (errored) {
        const error = "That didn't look like an OpenLifter file!";
        rememberThis.setState({ error: error });
      }
    };
    reader.readAsText(selectedFile);
  };

  handleSaveClick = () => {
    // TODO: Share this logic with ResultsView.
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      meetname = "Unnamed-Meet";
    }
    meetname = meetname.replace(/ /g, "-");

    const state = JSON.stringify(this.props.redux);
    const blob = new Blob([state], { type: "application/json;charset=utf-8" });
    saveAs(blob, meetname + ".openlifter");
  };

  renderContinueButton = () => {
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      // Unnamed or unstarted meet, so don't render a continue button
      return;
    }
    return (
      <LinkContainer to="/meet-setup">
        <Button variant="primary" block>
          Continue {meetname}
        </Button>
      </LinkContainer>
    );
  };

  render() {
    let newMeetButton = undefined;
    if (this.props.redux.meet.name) {
      // A meet is active: use the modal.
      newMeetButton = (
        <Button variant="primary" block onClick={this.handleNewClick}>
          New Meet
        </Button>
      );
    } else {
      // No meet is active: just use a LinkContainer.
      newMeetButton = (
        <LinkContainer to="/meet-setup">
          <Button variant="primary" block onClick={this.handleNewClick}>
            New Meet
          </Button>
        </LinkContainer>
      );
    }

    const wrongVersion: boolean = this.props.redux.versions.stateVersion !== stateVersion;
    const dataReleaseVersion = this.props.redux.versions.releaseVersion;

    const buttonMargin = { marginBottom: "5px" };

    let warning = null;
    if (wrongVersion === true) {
      warning = (
        <h2>
          <p>
            <b>DANGER!!!</b>
          </p>
          <p>
            The loaded meet was made in OpenLifter <b>{dataReleaseVersion}</b>.
          </p>
          <p>
            That format is incompatible with OpenLifter <b>{releaseVersion}</b>.
          </p>
        </h2>
      );
    }

    return (
      <Container style={centerConsole}>
        <NewMeetModal show={this.state.showNewMeetModal} close={this.closeConfirmModal} />
        <ErrorModal
          error={this.state.error}
          title="Load from File Error"
          show={this.state.error !== ""}
          close={this.closeErrorModal}
        />

        <Row>
          <Col md={12}>
            <img alt="OpenLifter" src="openlifter.svg" />
          </Col>
        </Row>

        <Row>
          <Col md={12}>{warning}</Col>
        </Row>

        <Row>
          <Col md={8}>
            <br />
            <div>
              {wrongVersion === false ? (
                this.renderContinueButton()
              ) : (
                <a href={"https://www.openlifter.com/releases/" + dataReleaseVersion}>
                  <Button variant="success" block style={{ marginBottom: "5px" }}>
                    Switch to OpenLifter {dataReleaseVersion}
                  </Button>
                </a>
              )}

              {newMeetButton}

              <Button variant="warning" block onClick={this.handleLoadClick}>
                Load from File
              </Button>
              <Button variant="success" block onClick={this.handleSaveClick}>
                Save to File
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <br />
            <a
              href="https://gitlab.com/openpowerlifting/openlifter/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button variant="outline-secondary" block style={buttonMargin}>
                Report an Issue
              </Button>
            </a>
            <a href="https://www.openlifter.com/support" rel="noopener noreferrer" target="_blank">
              <Button variant="outline-secondary" block style={buttonMargin}>
                Official Support
              </Button>
            </a>
            <a href="https://gitlab.com/openpowerlifting/openlifter" rel="noopener noreferrer" target="_blank">
              <Button variant="outline-secondary" block style={buttonMargin}>
                Full Source Code
              </Button>
            </a>
            <LinkContainer to="/about">
              <Button variant="outline-secondary" block style={buttonMargin}>
                Credits and License
              </Button>
            </LinkContainer>
          </Col>
        </Row>

        <Row>
          <Col md={12} style={{ textAlign: "center", marginTop: "2em" }}>
            <h3>
              Version {releaseVersion}, {releaseDate}.
            </h3>
          </Col>
        </Row>

        <input
          id="loadhelper"
          type="file"
          accept=".openlifter,.openlifter.txt"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </Container>
    );
  }
}

// Because we want to save the state, separate it out specifically
// into a "redux" prop. Otherwise it gets contaminated by other props.
const mapStateToProps = (state: GlobalState): StateProps => ({
  redux: {
    ...state
  }
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    overwriteStore: store => dispatch(overwriteStore(store))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer);
