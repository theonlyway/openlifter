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

// The parent component of the Results page, contained by the ResultsContainer.

import React from "react";
import { connect } from "react-redux";
import { Button, FormGroup, ControlLabel, FormControl, Panel } from "react-bootstrap";
import saveAs from "file-saver";

import ByDivision from "./ByDivision";
import ByPoints from "./ByPoints";

import { getWhetherPlatformsHaveLifted } from "../../logic/entry";
import { exportAsOplCsv } from "../../logic/export/oplcsv";
import { exportAsUSAPLCsv } from "../../logic/export/usapl";

import type { GlobalState } from "../../types/stateTypes";

import styles from "./ResultsView.module.scss";
const marginStyle = { margin: "0 20px 0 20px" };

interface StateProps {
  global: GlobalState;
}

type Props = StateProps;

interface InternalState {
  day: number;
  by: "Division" | "Points";
}

class ResultsView extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleByChange = this.handleByChange.bind(this);
    this.handleExportAsOplCsvClick = this.handleExportAsOplCsvClick.bind(this);
    this.handleExportAsUSAPLCsvClick = this.handleExportAsUSAPLCsvClick.bind(this);

    this.state = {
      day: 0, // Meaning "all". Flow complained about mixing numbers and strings.
      by: "Points"
    };
  }

  makeDayOptions = () => {
    let options = [
      <option key={"all"} value={0}>
        All Days Together
      </option>
    ];
    for (let day = 1; day < this.props.global.meet.lengthDays; day++) {
      options.push(
        <option key={day} value={day}>
          Just Day {day}
        </option>
      );
    }
    return options;
  };

  handleDayChange = event => {
    const day = event.target.value;
    if (this.state.day !== day) {
      this.setState({ day: day });
    }
  };

  handleByChange = event => {
    const by = event.target.value;
    if (this.state.by !== by) {
      this.setState({ by: by });
    }
  };

  handleExportAsOplCsvClick = event => {
    // TODO: Share this logic with HomeContainer.
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = "Unnamed-Meet";
    }
    meetname = meetname.replace(/ /g, "-");

    const csv: string = exportAsOplCsv(this.props.global);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, meetname + ".opl.csv");
  };

  handleExportAsUSAPLCsvClick = event => {
    // TODO: Share this logic with handleExportAsOplCsvClick.
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = "Unnamed-Meet";
    }
    meetname = meetname.replace(/ /g, "-");

    const csv: string = exportAsUSAPLCsv(this.props.global);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, meetname + ".USAPL.csv");
  };

  makePlatformMergeButtons = () => {
    // Array accessed by platformsHaveLifted[day-1][platform-1].
    const platformsHaveLifted: Array<Array<boolean>> = getWhetherPlatformsHaveLifted(
      this.props.global.meet.platformsOnDays,
      this.props.global.registration.entries
    );

    let forms = [];

    for (let i = 0; i < platformsHaveLifted.length; i++) {
      const liftedOnDay = platformsHaveLifted[i];

      let buttons = [];
      for (let j = 0; j < liftedOnDay.length; j++) {
        const actionText = liftedOnDay[j] === true ? "Export" : "Merge";
        const bsStyle = liftedOnDay[j] === true ? "success" : "warning";
        buttons.push(
          <Button key={i + "-" + j} bsStyle={bsStyle}>
            {actionText} Day {i + 1} Platform {j + 1}
          </Button>
        );
      }

      forms.push(
        <div key={i}>
          <div>Combine Platforms for Day {i + 1}</div>
          <div>{buttons}</div>
        </div>
      );
    }

    return forms;
  };

  render() {
    const results = this.state.by === "Division" ? <ByDivision /> : <ByPoints />;

    return (
      <div style={marginStyle}>
        <Panel bsStyle="primary">
          <Panel.Heading>Merge Platforms</Panel.Heading>
          <Panel.Body>{this.makePlatformMergeButtons()}</Panel.Body>
        </Panel>

        <Panel>
          <Panel.Heading>Export Official Results</Panel.Heading>
          <Panel.Body>
            <Button onClick={this.handleExportAsOplCsvClick}>Export for OpenPowerlifting</Button>

            <Button onClick={this.handleExportAsUSAPLCsvClick} style={{ marginLeft: "14px" }}>
              Export for USAPL
            </Button>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>Results For...</Panel.Heading>
          <Panel.Body className={styles.controlPanel}>
            <FormControl
              defaultValue={this.state.day}
              componentClass="select"
              onChange={this.handleDayChange}
              className={styles.dropdown}
            >
              {this.makeDayOptions()}
            </FormControl>

            <FormControl
              defaultValue={this.state.by}
              componentClass="select"
              onChange={this.handleByChange}
              className={styles.dropdown}
              style={{ marginLeft: "14px" }}
            >
              <option value="Division">By Division</option>
              <option value="Points">By Points</option>
            </FormControl>
          </Panel.Body>
        </Panel>

        {results}
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    global: state
  };
};

export default connect(
  mapStateToProps,
  null
)(ResultsView);
