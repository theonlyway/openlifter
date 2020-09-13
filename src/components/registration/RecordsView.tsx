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

import { GlobalState, MeetState, RecordsState, RegistrationState } from "../../types/stateTypes";
import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { LiftingRecord, Language, Sex, Equipment, RecordLift, RecordType, Lift } from "../../types/dataTypes";
import { importRecords } from "../../actions/recordActions";
import ErrorModal from "../ErrorModal";
import {
  getString,
  localizeEquipment,
  localizeRecordLift,
  localizeRecordType,
  localizeSex,
  localizeWeightClassStr,
} from "../../logic/strings";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Csv } from "../../logic/export/csv";
import { loadRecordsFromCsv, makeExampleRecordsCsv } from "../../logic/import/records-csv";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import {
  FormControlTypeHack,
  assertString,
  assertSex,
  assertEquipment,
  assertRecordLift,
  assertRecordType,
  checkExhausted,
  isNotUndefined,
} from "../../types/utils";
import { makeRecordsCsv } from "../../logic/export/records";
import { getUpdatedRecordState } from "../../logic/records";
import { displayNumber } from "../../logic/units";

type AnyOptionType = "Any";
const AnyOption: AnyOptionType = "Any";

interface StateProps {
  meet: MeetState;
  language: Language;
  updatedRecords: RecordsState;
  registration: RegistrationState;
}

interface DispatchProps {
  importRecords: (records: LiftingRecord[]) => void;
}

interface State {
  error: string;
  isLoadingFiles: boolean;
  divisionFilter: string | AnyOptionType;
  sexFilter: Sex | AnyOptionType;
  weightClassFilter: string | AnyOptionType;
  equipmentFilter: Equipment | AnyOptionType;
  recordLiftFilter: RecordLift | AnyOptionType;
  recordTypeFilter: RecordType | AnyOptionType;
}

type Props = StateProps & DispatchProps;

class RecordsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: "",
      isLoadingFiles: false,
      divisionFilter: AnyOption,
      sexFilter: AnyOption,
      weightClassFilter: AnyOption,
      equipmentFilter: AnyOption,
      recordLiftFilter: AnyOption,
      recordTypeFilter: AnyOption,
    };
  }

  closeErrorModal() {
    this.setState({ error: "" });
  }

  handleExportCsvClick() {
    const language = this.props.language;
    const text = makeRecordsCsv(this.props.updatedRecords, language);
    const blob = new Blob([text], { type: "application/text;charset=utf-8" });

    const basename = getString("records.export-filename", this.props.language);
    const filename = basename.replace("{MeetName}", this.props.meet.name) + ".csv";
    saveAs(blob, filename);
  }

  handleExportWebPageClick() {}

  handleDownloadCsvTemplateClick = () => {
    const text = makeExampleRecordsCsv(this.props.language);
    const blob = new Blob([text], { type: "application/text;charset=utf-8" });
    const filename = getString("import.template-filename", this.props.language) + ".csv";
    saveAs(blob, filename);
  };

  handleImportClick() {
    const loadhelper = document.getElementById("loadhelper");
    if (loadhelper !== null) {
      loadhelper.click();
    }
  }

  handleSexFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const sex = event.currentTarget.value;
    if (sex === AnyOption || (assertString(sex) && assertSex(sex))) {
      this.setState({
        sexFilter: sex,
      });
    }
  }

  handleDivisionFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const value = event.currentTarget.value;
    if (value !== undefined) {
      this.setState({
        divisionFilter: value,
      });
    }
  }

  handleWeightClassFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const value = event.currentTarget.value;
    if (value !== undefined) {
      this.setState({
        weightClassFilter: value,
      });
    }
  }

  handleEquipmentFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const equipment = event.currentTarget.value;
    if (equipment === AnyOption || (assertString(equipment) && assertEquipment(equipment))) {
      this.setState({
        equipmentFilter: equipment,
      });
    }
  }

  handleRecordLiftFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const recordLift = event.currentTarget.value;
    if (recordLift === AnyOption || (assertString(recordLift) && assertRecordLift(recordLift))) {
      this.setState({
        recordLiftFilter: recordLift,
      });
    }
  }

  handleRecordTypeFilterChange(event: React.FormEvent<FormControlTypeHack>) {
    const recordType = event.currentTarget.value;
    if (recordType === AnyOption || (assertString(recordType) && assertRecordType(recordType))) {
      this.setState({
        recordTypeFilter: recordType,
      });
    }
  }

  handleLoadFileInput() {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement) || loadHelper.files === null) {
      return;
    }

    const selectedFile = loadHelper.files[0];

    const reader = new FileReader();

    reader.onload = () => {
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
        this.setState({ error: maybeError });
        return;
      }

      // Try to parse the CSV into records
      const maybeRecords = loadRecordsFromCsv(csv, this.props.meet, this.props.language);
      if (typeof maybeRecords === "string") {
        this.setState({ error: maybeRecords });
        return;
      }

      // Successfully parsed and loaded!
      const records: LiftingRecord[] = maybeRecords;
      this.props.importRecords(records);
    };

    reader.onloadstart = () => {
      this.setState({ isLoadingFiles: true });
    };

    reader.onloadend = () => {
      this.setState({ isLoadingFiles: false });
    };

    reader.readAsText(selectedFile);

    // this will reset the input field so the same file can be selected again. Without this picking the same file for import silently does nothing
    loadHelper.value = "";
  }

  getEligibleWeightClasses(filterType: Sex | AnyOptionType): string[] {
    const meet = this.props.meet;

    if (filterType == AnyOption) {
      return this.getEligibleWeightClasses("M")
        .concat(this.getEligibleWeightClasses("F"))
        .concat(this.getEligibleWeightClasses("Mx"));
    }

    let classes: readonly number[];
    if (filterType === "M") {
      classes = meet.weightClassesKgMen;
    } else if (filterType === "F") {
      classes = meet.weightClassesKgWomen;
    } else if (filterType === "Mx") {
      classes = meet.weightClassesKgMx;
    } else {
      checkExhausted(filterType);
      classes = [];
    }

    let allOptions = classes.map((c) => c.toString());
    // If there is at least one class, include the SHW class
    if (allOptions.length > 0) {
      allOptions = allOptions.concat([classes[classes.length - 1] + "+"]);
    }
    return allOptions;
  }

  render() {
    const filteredRecords = Object.entries(this.props.updatedRecords.confirmedRecords)
      .map((kvp) => kvp[1])
      .filter(isNotUndefined)
      .filter((record) => {
        return (
          record !== undefined &&
          (this.state.divisionFilter === AnyOption || this.state.divisionFilter === record.division) &&
          (this.state.sexFilter === AnyOption || this.state.sexFilter === record.sex) &&
          (this.state.weightClassFilter === AnyOption || this.state.weightClassFilter === record.weightClass) &&
          (this.state.equipmentFilter === AnyOption || this.state.equipmentFilter === record.equipment) &&
          (this.state.recordLiftFilter === AnyOption || this.state.recordLiftFilter === record.recordLift) &&
          (this.state.recordTypeFilter === AnyOption || this.state.recordTypeFilter === record.recordType)
        );
      });

    return (
      <div>
        <ErrorModal
          error={this.state.error}
          title={getString("common.importation-error", this.props.language)}
          show={this.state.error !== ""}
          close={() => this.closeErrorModal()}
        />

        <Card style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage id="records.auto-import-card-header" defaultMessage="Auto-Import Records" />
          </Card.Header>
          <Card.Body>
            <Button variant="info" onClick={() => this.handleDownloadCsvTemplateClick()}>
              <FormattedMessage id="registration.button-download-template" defaultMessage="Download Template" />
            </Button>{" "}
            <Button variant="danger" onClick={() => this.handleImportClick()} style={{ marginLeft: "14px" }}>
              {this.state.isLoadingFiles && <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSpinner} spin />}
              <FormattedMessage id="records.button-overwrite-from-csv" defaultMessage="Overwrite Records from CSV" />
            </Button>
            <Button variant="success" onClick={() => this.handleExportCsvClick()} style={{ marginLeft: "14px" }}>
              <FormattedMessage id="registration.button-export-to-csv" defaultMessage="Export to CSV" />
            </Button>
            <Button variant="primary" onClick={() => this.handleExportWebPageClick()} style={{ marginLeft: "14px" }}>
              <FormattedMessage id="records.export-as-web-page" defaultMessage="Export to CSV" />
            </Button>
          </Card.Body>
        </Card>
        <input
          id="loadhelper"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={() => this.handleLoadFileInput()}
        />
        <Card style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage id="records.filter-header" defaultMessage="Filter Records" />
          </Card.Header>
          <Card.Body>
            <Row>
              {/* Division */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="lifting.column-division" defaultMessage="Division" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.divisionFilter}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) => this.handleDivisionFilterChange(event)}
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    {this.props.meet.divisions.map((division, i) => {
                      return (
                        <option key={i} value={division}>
                          {division}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* Sex */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.sex-label" defaultMessage="Sex" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.sexFilter}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) => this.handleSexFilterChange(event)}
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    <option value="M">{getString("sex.m", this.props.language)}</option>
                    <option value="F">{getString("sex.f", this.props.language)}</option>
                    <option value="Mx">{getString("sex.mx", this.props.language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* Weight Class */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="lifting.column-weightclass" defaultMessage="Class" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.weightClassFilter.toString()}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) =>
                      this.handleWeightClassFilterChange(event)
                    }
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    {this.getEligibleWeightClasses(this.state.sexFilter).map((weightClass, i) => {
                      return (
                        <option key={i} value={weightClass}>
                          {weightClass}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* Equipment */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.equipment-label" defaultMessage="Equipment" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.equipmentFilter}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) => this.handleEquipmentFilterChange(event)}
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    <option value="Bare">{getString("equipment.bare", this.props.language)}</option>
                    <option value="Sleeves">{getString("equipment.sleeves", this.props.language)}</option>
                    <option value="Wraps">{getString("equipment.wraps", this.props.language)}</option>
                    <option value="Single-ply">{getString("equipment.single-ply", this.props.language)}</option>
                    <option value="Multi-ply">{getString("equipment.multi-ply", this.props.language)}</option>
                    <option value="Unlimited">{getString("equipment.unlimited", this.props.language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* Record Lift */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="records.lift-label" defaultMessage="Lift" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.recordLiftFilter}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) => this.handleRecordLiftFilterChange(event)}
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    <option value="S">{getString("event.s", this.props.language)}</option>
                    <option value="B">{getString("event.b", this.props.language)}</option>
                    <option value="D">{getString("event.d", this.props.language)}</option>
                    <option value="Total">{getString("formula.total", this.props.language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {/* Record Type */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="records.record-type-label" defaultMessage="Record Type" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.recordTypeFilter}
                    as="select"
                    onChange={(event: React.FormEvent<FormControlTypeHack>) => this.handleRecordTypeFilterChange(event)}
                    className="custom-select"
                  >
                    <option value={AnyOption}>{getString("common.any", this.props.language)}</option>
                    <option value="FullPower">
                      {getString("records.record-type.full-power", this.props.language)}
                    </option>
                    <option value="SingleLift">
                      {getString("records.record-type.single-lift", this.props.language)}
                    </option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Weight</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Division</th>
                    <th>Sex</th>
                    <th>Weight Class</th>
                    <th>Equipment</th>
                    <th>Lift</th>
                    <th>Record Type</th>
                  </tr>
                </thead>
                <tbody>{filteredRecords.map((record, index) => this.renderRow(record, index))}</tbody>
              </Table>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }

  renderRow(record: LiftingRecord, index: number) {
    return (
      <tr key={index}>
        <td>{record.fullName}</td>
        <td>{displayNumber(record.weight, this.props.language)}</td>
        <td>{record.date}</td>
        <td>{record.location}</td>
        <td>{record.division}</td>
        <td>{localizeSex(record.sex, this.props.language)}</td>
        <td>{localizeWeightClassStr(record.weightClass, this.props.language)}</td>
        <td>{localizeEquipment(record.equipment, this.props.language)}</td>
        <td>{localizeRecordLift(record.recordLift, this.props.language)}</td>
        <td>{localizeRecordType(record.recordType, this.props.language)}</td>
      </tr>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  meet: state.meet,
  updatedRecords: getUpdatedRecordState(state.records, state.meet, state.registration, state.language),
  registration: state.registration,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    importRecords: (records) => dispatch(importRecords(records)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecordsView);
