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

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LinkContainer } from "react-router-bootstrap";

import { saveAs } from "file-saver";

import { FormattedMessage } from "react-intl";
import LanguageSelector from "../components/translations/LanguageSelector";
import { overwriteStore } from "../actions/globalActions";

import NewMeetModal from "../components/home/NewMeetModal";
import ErrorModal from "../components/ErrorModal";

import { getString } from "../logic/strings";

import { stateVersion, releaseVersion, releaseDate } from "../versions";

import styles from "../components/common/ContentArea.module.scss";

import { GlobalState } from "../types/stateTypes";
import { Dispatch } from "redux";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 700, marginRight: "auto", marginLeft: "auto" };

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

// Gets links and buttons to have the same vertical spacing.
const buttonMargin = { marginBottom: "8px" };

class HomeContainer extends React.Component<Props, InternalState> {
  constructor(props: Props) {
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
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement) || loadHelper.files === null) {
      return;
    }

    const selectedFile = loadHelper.files[0];
    const language = this.props.redux.language;
    const rememberThis = this;

    const reader = new FileReader();
    reader.onload = function (event: any) {
      let errored = false;
      try {
        const obj = JSON.parse(event.target.result);

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
        const error = getString("error.invalid-openlifter", language);
        rememberThis.setState({ error: error });
      }
    };
    reader.readAsText(selectedFile);

    // this will reset the input field so the same file can be selected again. Without this picking the same file for import silently does nothing
    loadHelper.value = "";
  };

  handleSaveClick = () => {
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      meetname = getString("common.unnamed-filename", this.props.redux.language);
    }
    meetname = meetname.replace(/ /g, "-");

    const state = JSON.stringify(this.props.redux);
    const blob = new Blob([state], { type: "application/json;charset=utf-8" });
    saveAs(blob, meetname + ".openlifter");
  };

  renderContinueButton = () => {
    const meetname = this.props.redux.meet.name;
    if (meetname === "") {
      // Unnamed or unstarted meet, so don't render a continue button
      return;
    }
    return (
      <LinkContainer to="/meet-setup">
        <Button variant="primary" block style={buttonMargin}>
          <FormattedMessage
            id="home.button-continue"
            defaultMessage="Continue {meetName}"
            values={{ meetName: meetname }}
          />
        </Button>
      </LinkContainer>
    );
  };

  render() {
    let newMeetButton = (
      <Button variant="primary" block onClick={this.handleNewClick} style={buttonMargin}>
        <FormattedMessage id="home.button-new-meet" defaultMessage="New Meet" />
      </Button>
    );

    // If no meet is active, make the button just a LinkContainer.
    if (!this.props.redux.meet.name) {
      newMeetButton = <LinkContainer to="/meet-setup">{newMeetButton}</LinkContainer>;
    }

    const isBeta: boolean = releaseVersion.includes("eta");
    let betaWarning = null;
    if (isBeta === true) {
      betaWarning = (
        <h3>
          <p>
            <FormattedMessage
              id="home.beta-warning"
              defaultMessage="This is the in-development, next version of OpenLifter. The internal data format is unstable. Do not use this to run competitions!"
            />
          </p>
        </h3>
      );
    }

    const wrongVersion: boolean = this.props.redux.versions.stateVersion !== stateVersion;
    const dataReleaseVersion = this.props.redux.versions.releaseVersion;

    const language = this.props.redux.language;

    let warning = null;
    if (wrongVersion === true) {
      warning = (
        <h3>
          <p>
            <b>{getString("common.danger-allcaps", language)}</b>
          </p>
          <p>
            <FormattedMessage
              id="home.wrong-version-warning"
              defaultMessage="The loaded meet was made in OpenLifter {oldVersion}. That format is incompatible with OpenLifter {thisVersion}."
              values={{ oldVersion: dataReleaseVersion, thisVersion: releaseVersion }}
            />
          </p>
        </h3>
      );
    }

    return (
      <Card style={centerConsole} className={styles.contentArea}>
        <NewMeetModal show={this.state.showNewMeetModal} close={this.closeConfirmModal} />
        <ErrorModal
          error={this.state.error}
          title={getString("home.error-load-popup-title", language)}
          show={this.state.error !== ""}
          close={this.closeErrorModal}
        />

        <Card.Header>
          <img alt="OpenLifter" src="openlifter.svg" />
          {betaWarning}
        </Card.Header>

        <Card.Body>
          <Container>
            <Row>{warning}</Row>
            <Row style={buttonMargin}>
              <Col md={8}>
                {wrongVersion === false ? (
                  this.renderContinueButton()
                ) : (
                  <a href={"https://www.openlifter.com/releases/" + dataReleaseVersion}>
                    <Button variant="success" block>
                      <FormattedMessage
                        id="home.button-switch-version"
                        defaultMessage="Switch to OpenLifter {otherVersion}"
                        values={{ otherVersion: dataReleaseVersion }}
                      />
                    </Button>
                  </a>
                )}
              </Col>
              <Col md={4}>
                <LanguageSelector />
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <div>
                  {newMeetButton}

                  <Button variant="warning" block onClick={this.handleLoadClick} style={buttonMargin}>
                    <FormattedMessage id="home.button-load-from-file" defaultMessage="Load from File" />
                  </Button>
                  <Button variant="success" block onClick={this.handleSaveClick} style={buttonMargin}>
                    <FormattedMessage id="home.button-save-tofile" defaultMessage="Save to File" />
                  </Button>
                </div>
              </Col>

              <Col md={4}>
                <a
                  href="https://gitlab.com/openpowerlifting/openlifter/issues/new"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button variant="outline-secondary" block style={buttonMargin}>
                    <FormattedMessage id="home.button-report-issue" defaultMessage="Report an Issue" />
                  </Button>
                </a>
                <a href="https://www.openlifter.com/support" rel="noopener noreferrer" target="_blank">
                  <Button variant="outline-secondary" block style={buttonMargin}>
                    <FormattedMessage id="home.button-support" defaultMessage="Official Support" />
                  </Button>
                </a>
                <a href="https://gitlab.com/openpowerlifting/openlifter" rel="noopener noreferrer" target="_blank">
                  <Button variant="outline-secondary" block style={buttonMargin}>
                    <FormattedMessage id="home.button-source" defaultMessage="Full Source Code" />
                  </Button>
                </a>
                <LinkContainer to="/about">
                  <Button variant="outline-secondary" block style={buttonMargin}>
                    <FormattedMessage id="home.button-credits" defaultMessage="Credits and License" />
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </Container>
        </Card.Body>

        <Card.Footer>
          <h4 style={{ textAlign: "center" }}>
            <FormattedMessage
              id="home.version-date"
              defaultMessage="Version {releaseVersion}, {releaseDate}."
              values={{
                releaseVersion: releaseVersion,
                releaseDate: releaseDate,
              }}
            />
          </h4>
        </Card.Footer>

        <input
          id="loadhelper"
          type="file"
          accept=".openlifter,.openlifter.txt"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </Card>
    );
  }
}

// Because we want to save the state, separate it out specifically
// into a "redux" prop. Otherwise it gets contaminated by other props.
const mapStateToProps = (state: GlobalState): StateProps => ({
  redux: {
    ...state,
  },
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    overwriteStore: (store) => dispatch(overwriteStore(store)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
