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
import { Button, FormControl, Panel } from "react-bootstrap";

import ByDivision from "./ByDivision";
import ByPoints from "./ByPoints";

import { exportAsOplCsv } from "../../logic/export/oplcsv";

import saveAs from "file-saver";

import styles from "./ResultsView.module.scss";

import type { GlobalState } from "../../types/stateTypes";

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

  render() {
    const results = this.state.by === "Division" ? <ByDivision /> : <ByPoints />;

    return (
      <div style={marginStyle}>
        <Panel bsStyle="primary">
          <Panel.Heading>Export Results</Panel.Heading>
          <Panel.Body>
            <Button bsStyle="primary" onClick={this.handleExportAsOplCsvClick}>
              Export for OpenPowerlifting
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
