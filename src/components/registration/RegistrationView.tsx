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

// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";

import { faSpinner, faTimes, faRandom, faSort, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LifterTable from "./LifterTable";
import LifterRow from "./LifterRow";
import NewButton from "./NewButton";
import ErrorModal from "../ErrorModal";

import { Csv } from "../../logic/export/csv";
import { makeExampleRegistrationsCsv, loadRegistrations } from "../../logic/import/registration-csv";
import { makeRegistrationsCsv } from "../../logic/export/registrations";
import { getString } from "../../logic/strings";

import { newRegistration, deleteRegistration, assignLotNumbers } from "../../actions/registrationActions";

import { saveAs } from "file-saver";

import { GlobalState } from "../../types/stateTypes";
import { Entry } from "../../types/dataTypes";
import { Dispatch } from "redux";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { shuffle } from "../debug/RandomizeHelpers";
import { generateRandomLotNumbersSequencedByFlight } from "../../logic/lotNumbers";

interface StateProps {
  global: GlobalState;
}

interface DispatchProps {
  newRegistration: (obj: Partial<Entry>) => void;
  deleteRegistration: (id: number) => void;
  assignLotNumbers: (lotNumbers: number[]) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  // Controls the ErrorModal popup. Shown when error !== "".
  error: string;
  // Used for showing spinning indicators when loading files
  isLoadingFiles: boolean;
}

// Used to distinguish between the Overwrite and Append modes.
let globalImportKind: string = "Overwrite";

class RegistrationView extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);
    this.handleDownloadCsvTemplateClick = this.handleDownloadCsvTemplateClick.bind(this);
    this.handleExportCsvClick = this.handleExportCsvClick.bind(this);
    this.handleOverwriteClick = this.handleOverwriteClick.bind(this);
    this.handleAppendClick = this.handleAppendClick.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.handleSequentialLotNumbersClick = this.handleSequentialLotNumbersClick.bind(this);
    this.handleRandomLotNumbersClick = this.handleRandomLotNumbersClick.bind(this);
    this.handleRandomLotNumbersByFlightClick = this.handleRandomLotNumbersByFlightClick.bind(this);
    this.handleRemoveLotNumbersClick = this.handleRemoveLotNumbersClick.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);

    this.state = { error: "", isLoadingFiles: false };
  }

  handleDownloadCsvTemplateClick = () => {
    const text = makeExampleRegistrationsCsv(this.props.global.language);
    const blob = new Blob([text], { type: "application/text;charset=utf-8" });
    const filename = getString("import.template-filename", this.props.global.language) + ".csv";
    saveAs(blob, filename);
  };

  handleExportCsvClick = () => {
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = getString("common.unnamed-filename", this.props.global.language);
    }
    meetname = meetname.replace(/ /g, "-");

    const language = this.props.global.language;
    const text = makeRegistrationsCsv(this.props.global.registration, language);
    const blob = new Blob([text], { type: "application/text;charset=utf-8" });

    const basename = getString("import.export-filename", this.props.global.language);
    const filename = basename.replace("{MeetName}", meetname) + ".csv";
    saveAs(blob, filename);
  };

  handleOverwriteClick = () => {
    globalImportKind = "Overwrite";
    const loadhelper = document.getElementById("loadhelper");
    if (loadhelper !== null) {
      loadhelper.click();
    }
  };

  handleSequentialLotNumbersClick = () => {
    this.updateLotNumbers("AssignSequentially");
  };

  handleRandomLotNumbersClick = () => {
    this.updateLotNumbers("AssignRandomly");
  };

  handleRandomLotNumbersByFlightClick = () => {
    this.updateLotNumbers("RandomByFlight");
  };

  handleRemoveLotNumbersClick = () => {
    this.updateLotNumbers("RemoveAll");
  };

  updateLotNumbers = (manipulation: "AssignSequentially" | "RandomByFlight" | "AssignRandomly" | "RemoveAll"): void => {
    const entries = this.props.global.registration.entries;
    let lotNumbers: number[];

    // Removing lot numbers is as simple as setting the number to 0
    if (manipulation === "RemoveAll") {
      lotNumbers = entries.map(() => 0);
    } else if (manipulation === "RandomByFlight") {
      lotNumbers = generateRandomLotNumbersSequencedByFlight(this.props.global.registration.entries);
    } else {
      // If not removing, generate a set of sequential lot numbers for all lifters.
      lotNumbers = entries.map((_entry, index) => index + 1);
    }

    // If randomization was requested, shuffle the lot number array in-place.
    if (manipulation === "AssignRandomly") {
      shuffle(lotNumbers);
    }

    // Finally, update the lot numbers in the state
    this.props.assignLotNumbers(lotNumbers);
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
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement) || loadHelper.files === null) {
      return;
    }

    const selectedFile = loadHelper.files[0];
    const rememberThis = this;

    const reader = new FileReader();

    reader.onload = function () {
      // If this occurs, we've introduced a bug when initiating the file reader, or the read failed.
      // Add this check as a guard so the typing is narrowed
      if (typeof reader.result !== "string") {
        window.alert("Unable to load file: an unexpected internal error occured");
        return;
      }

      const csv = new Csv();
      const maybeError = csv.fromString(reader.result.replace(/;/g, ","));

      // Check if an error message occurred.
      if (typeof maybeError === "string") {
        rememberThis.setState({ error: maybeError });
        return;
      }

      // Convert the Csv to an Array<Entry>.
      const language = rememberThis.props.global.language;
      const maybeEntries = loadRegistrations(rememberThis.props.global, csv, language);
      if (typeof maybeEntries === "string") {
        rememberThis.setState({ error: maybeEntries });
        return;
      }

      // Successfully parsed and loaded!
      const entries: Array<Partial<Entry>> = maybeEntries;

      // If the mode is "Overwrite", delete all existing Entries.
      if (globalImportKind === "Overwrite") {
        const entryIds = rememberThis.props.global.registration.entries.map((e) => e.id);
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

    reader.onloadstart = function () {
      rememberThis.setState({ isLoadingFiles: true });
    };

    reader.onloadend = function () {
      rememberThis.setState({ isLoadingFiles: false });
    };

    reader.readAsText(selectedFile);
  };

  closeErrorModal = () => {
    this.setState({ error: "" });
  };

  render() {
    const numEntries = this.props.global.registration.entries.length;
    const dropdownIconStyle = { width: "16px", marginRight: "6px" };

    return (
      <div>
        <ErrorModal
          error={this.state.error}
          title={getString("registration.importation-error", this.props.global.language)}
          show={this.state.error !== ""}
          close={this.closeErrorModal}
        />

        <Card style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage id="registration.auto-import-card-header" defaultMessage="Auto-Import Registrations" />
          </Card.Header>
          <Card.Body>
            <Button variant="info" onClick={this.handleDownloadCsvTemplateClick}>
              <FormattedMessage id="registration.button-download-template" defaultMessage="Download Template" />
            </Button>

            <Button
              variant="success"
              disabled={numEntries === 0}
              onClick={this.handleExportCsvClick}
              style={{ marginLeft: "14px" }}
            >
              <FormattedMessage id="registration.button-export-to-csv" defaultMessage="Export to CSV" />
            </Button>

            <ButtonGroup style={{ marginLeft: "14px" }}>
              <Button variant="danger" onClick={this.handleOverwriteClick}>
                {this.state.isLoadingFiles && <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSpinner} spin />}
                <FormattedMessage
                  id="registration.button-overwrite-from-csv"
                  defaultMessage="Overwrite Registrations from CSV"
                />
              </Button>
              <Button variant="warning" onClick={this.handleAppendClick}>
                <FormattedMessage
                  id="registration.button-append-from-csv"
                  defaultMessage="Append Registrations from CSV"
                />
              </Button>
            </ButtonGroup>
          </Card.Body>
        </Card>

        <Card style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage id="registration.tools-header" defaultMessage="Tools" />
          </Card.Header>
          <Card.Body>
            <ButtonGroup vertical>
              <DropdownButton
                as={ButtonGroup}
                title={
                  <FormattedMessage id="registration.dropdown-manage-lot-numbers" defaultMessage="Manage Lot Numbers" />
                }
                id="registration.button-assign-lot-numbers"
              >
                <Dropdown.Item onClick={this.handleSequentialLotNumbersClick}>
                  <FontAwesomeIcon icon={faSort} style={dropdownIconStyle} />
                  <FormattedMessage
                    id="registration.button-assign-lot-numbers-sequentially"
                    defaultMessage="Assign Sequentially"
                  />
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleRandomLotNumbersClick}>
                  <FontAwesomeIcon icon={faRandom} style={dropdownIconStyle} />
                  <FormattedMessage
                    id="registration.button-assign-lot-numbers-randomly"
                    defaultMessage="Assign Randomly"
                  />
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleRandomLotNumbersByFlightClick}>
                  <FontAwesomeIcon icon={faDice} style={dropdownIconStyle} />
                  <FormattedMessage
                    id="registration.button-assign-lot-numbers-randomly-by-flight"
                    defaultMessage="Assign Randomly By Flight"
                  />
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleRemoveLotNumbersClick}>
                  <FontAwesomeIcon icon={faTimes} style={dropdownIconStyle} />
                  <FormattedMessage id="registration.button-remove-lot-numbers" defaultMessage="Remove Lot Numbers" />
                </Dropdown.Item>
              </DropdownButton>
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
  global: state,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    newRegistration: (obj: Partial<Entry>) => dispatch(newRegistration(obj)),
    deleteRegistration: (id: number) => dispatch(deleteRegistration(id)),
    assignLotNumbers: (lotNumbers: number[]) => dispatch(assignLotNumbers(lotNumbers)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
