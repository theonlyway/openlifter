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

// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";

import LifterTable from "./LifterTable";
import LifterRow from "./LifterRow";
import NewButton from "./NewButton";
import ErrorModal from "../ErrorModal";

import { Csv } from "../../logic/export/csv";
import { makeExampleRegistrationsCsv, loadRegistrations } from "../../logic/import/registration-csv";

import { newRegistration, deleteRegistration } from "../../actions/registrationActions";

import saveAs from "file-saver";

import type { GlobalState } from "../../types/stateTypes";
import type { Entry } from "../../types/dataTypes";

interface StateProps {
  global: GlobalState;
}

interface DispatchProps {
  newRegistration: (obj: $Shape<Entry>) => any;
  deleteRegistration: (id: number) => any;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  // Controls the ErrorModal popup. Shown when error !== "".
  error: string;
}

const marginStyle = { margin: "0 20px 20px 20px" };

// Used to distinguish between the Overwrite and Append modes.
var globalImportKind: string = "Overwrite";

class RegistrationView extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);
    this.handleDownloadCsvTemplateClick = this.handleDownloadCsvTemplateClick.bind(this);
    this.handleOverwriteClick = this.handleOverwriteClick.bind(this);
    this.handleAppendClick = this.handleAppendClick.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);

    this.state = { error: "" };
  }

  handleDownloadCsvTemplateClick = () => {
    const text = makeExampleRegistrationsCsv();
    const blob = new Blob([text], { type: "application/text;charset=utf-8" });
    saveAs(blob, "registration-template.csv");
  };

  handleOverwriteClick = () => {
    globalImportKind = "Overwrite";
    const loadhelper = document.getElementById("loadhelper");
    if (loadhelper !== null) {
      loadhelper.click();
    }
  };

  handleAppendClick = () => {
    globalImportKind = "Append";
    const loadhelper = document.getElementById("loadhelper");
    if (loadhelper !== null) {
      loadhelper.click();
    }
  };

  handleLoadFileInput = () => {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement)) {
      return;
    }

    const selectedFile = loadHelper.files[0];
    let rememberThis = this;

    let reader = new FileReader();
    reader.onload = function(event) {
      let csv = new Csv();
      const maybeError = csv.fromString(event.target.result);

      // Check if an error message occurred.
      if (typeof maybeError === "string") {
        rememberThis.setState({ error: maybeError });
        return;
      }

      // Convert the Csv to an Array<Entry>.
      const maybeEntries = loadRegistrations(rememberThis.props.global, csv);
      if (typeof maybeEntries === "string") {
        rememberThis.setState({ error: maybeEntries });
        return;
      }

      // Successfully parsed and loaded!
      const entries: Array<Entry> = maybeEntries;

      // If the mode is "Overwrite", delete all existing Entries.
      if (globalImportKind === "Overwrite") {
        const entryIds = rememberThis.props.global.registration.entries.map(e => e.id);
        for (let i = 0; i < entryIds.length; ++i) {
          rememberThis.props.deleteRegistration(entryIds[i]);
        }
      }

      // Add all the new Entries.
      for (let i = 0; i < entries.length; ++i) {
        // Deleting the 'id' field causes newRegistration() to assign a valid one.
        delete entries[i].id;
        rememberThis.props.newRegistration(entries[i]);
      }
    };
    reader.readAsText(selectedFile);
  };

  closeErrorModal = () => {
    this.setState({ error: "" });
  };

  render() {
    return (
      <div style={marginStyle}>
        <ErrorModal
          error={this.state.error}
          title="Importation Error"
          show={this.state.error !== ""}
          close={this.closeErrorModal}
        />

        <Card variant="info">
          <Card.Header>Auto-Import Registrations</Card.Header>
          <Card.Body>
            <Button variant="info" onClick={this.handleDownloadCsvTemplateClick}>
              Download Template
            </Button>

            <ButtonGroup style={{ marginLeft: "14px" }}>
              <Button variant="danger" onClick={this.handleOverwriteClick}>
                Overwrite Registrations from CSV
              </Button>
              <Button variant="warning" onClick={this.handleAppendClick}>
                Append Registrations from CSV
              </Button>
            </ButtonGroup>
          </Card.Body>
        </Card>

        <LifterTable entries={this.props.global.registration.entries} rowRenderer={LifterRow} />
        <NewButton />

        <input
          id="loadhelper"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  global: state
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    newRegistration: (obj: $Shape<Entry>) => dispatch(newRegistration(obj)),
    deleteRegistration: (id: number) => dispatch(deleteRegistration(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationView);
