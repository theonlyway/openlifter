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
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import saveAs from "file-saver";

import LanguageSelector from "../components/translations/LanguageSelector";
import { overwriteStore } from "../actions/globalActions";

import NewMeetModal from "../components/home/NewMeetModal";

import { releaseVersion, releaseDate } from "../versions";

import type { GlobalState } from "../types/stateTypes";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 800, margin: "0 auto 10px" };
const buttonConsole = { maxWidth: 400, margin: "20px auto 0 auto" };

interface StateProps {
  redux: GlobalState;
}

interface DispatchProps {
  overwriteStore: (store: GlobalState) => void;
}

interface InternalState {
  showNewMeetModal: boolean;
}

type Props = StateProps & DispatchProps;

class HomeContainer extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleNewClick = this.handleNewClick.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.renderContinueButton = this.renderContinueButton.bind(this);

    this.state = { showNewMeetModal: false };
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
        // TODO: Be a little more helpful.
        window.alert("That didn't look like an OpenLifter file!");
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
      <div style={{ marginBottom: "2rem" }}>
        <h3>In Progress: {meetname}</h3>
        <LinkContainer to="/meet-setup">
          <Button bsStyle="success" bsSize="large" block>
            Continue Current Meet
          </Button>
        </LinkContainer>
      </div>
    );
  };

  render() {
    return (
      <div style={centerConsole}>
        <NewMeetModal show={this.state.showNewMeetModal} close={this.closeConfirmModal} />
        <LanguageSelector />
        <h1>
          Welcome to OpenLifter v{releaseVersion}!<br />
          Released: {releaseDate}
        </h1>
        <h2>
          <p>
            This is the <b>development build</b> of OpenLifter.
          </p>
          <p>
            Please <b>do not</b> use this to run a meet unless you have confirmed with us in advance, and we have
            committed to not making breaking changes during your meet.
          </p>
          <p>
            This version <b>changes unexpectedly</b> and <b>does not guarantee stability</b> for your meet.
          </p>
        </h2>
        <div style={buttonConsole}>
          {this.renderContinueButton()}
          <Button bsStyle="primary" bsSize="large" block onClick={this.handleNewClick}>
            New Meet
          </Button>
          <Button bsStyle="warning" bsSize="large" block onClick={this.handleLoadClick}>
            Load from File
          </Button>
          <Button bsStyle="success" bsSize="large" block onClick={this.handleSaveClick}>
            Save to File
          </Button>
        </div>

        <input
          id="loadhelper"
          type="file"
          accept=".openlifter"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </div>
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
