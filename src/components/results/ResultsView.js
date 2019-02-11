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
import saveAs from "file-saver";

import ByDivision from "./ByDivision";
import ByPoints from "./ByPoints";

import { mergePlatform } from "../../actions/registrationActions";

import { liftingPresentOnPlatform, getWhetherPlatformsHaveLifted } from "../../logic/entry";
import { exportAsOplCsv } from "../../logic/export/oplcsv";
import { exportAsUSAPLCsv } from "../../logic/export/usapl";

import type { Entry } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

import styles from "./ResultsView.module.scss";
const marginStyle = { margin: "0 20px 0 20px" };

interface StateProps {
  global: GlobalState;
}

interface DispatchProps {
  mergePlatform: (day: number, platform: number, platformEntries: Array<Entry>) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  day: number;
  by: "Division" | "Points";
}

// FIXME: Unfortunate use of globals :/ I don't have a better idea.
// This is to pass information from the merge button click handler to the
// file loader click handler.
let globalMergeDay: number = 0;
let globalMergePlatform: number = 0;

class ResultsView extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleByChange = this.handleByChange.bind(this);
    this.handleExportAsOplCsvClick = this.handleExportAsOplCsvClick.bind(this);
    this.handleExportAsUSAPLCsvClick = this.handleExportAsUSAPLCsvClick.bind(this);
    this.handleExportPlatformClick = this.handleExportPlatformClick.bind(this);
    this.handleMergePlatformClick = this.handleMergePlatformClick.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);

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

  handleExportPlatformClick = (day: number, platform: number, event: Object) => {
    // TODO: Share this logic with handleExportAsOplCsvClick.
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = "Unnamed-Meet";
    }
    meetname = meetname.replace(/ /g, "-");
    const exportname = meetname + "-Day-" + day + "-Platform-" + platform;

    const state = JSON.stringify(this.props.global);
    const blob = new Blob([state], { type: "application/json;charset=utf-8" });
    saveAs(blob, exportname + ".export.openlifter");
  };

  // The file input is hidden, and we want to use a button to activate it.
  // This event handler makes a proxy call to the *real* event handler.
  handleMergePlatformClick = (day: number, platform: number, event: Object) => {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper !== null) {
      globalMergeDay = day;
      globalMergePlatform = platform;
      loadHelper.click();
    }
  };

  // Called when a file is selected for merging platform data.
  handleLoadFileInput = () => {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement)) {
      return;
    }

    // Get the (day, platform) from global state.
    const day: number = globalMergeDay;
    const platform: number = globalMergePlatform;

    // Remember the props in the onload() closure.
    let props = this.props;

    const selectedFile = loadHelper.files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
      let error: string | null = null;
      try {
        let obj: GlobalState = JSON.parse(event.target.result);

        // stateVersion must match.
        if (obj.versions.stateVersion !== props.global.versions.stateVersion) {
          error =
            "This meet uses data version " +
            props.global.versions.stateVersion +
            ", but the selected file uses data version " +
            obj.versions.stateVersion;
        } else if (obj.meet.name !== props.global.meet.name) {
          // The meet name must match, for sanity checking.
          error =
            "This meet is named '" +
            props.global.meet.name +
            "', but the selected file is for the meet '" +
            obj.meet.name +
            "'.";
        } else if (!liftingPresentOnPlatform(obj.registration.entries, day, platform)) {
          // The meet must actually contain data from the given (day, platform).
          error = "The selected file doesn't have any lifting data for Day " + day + " Platform " + platform + ".";
        } else {
          // Sanity checks passed: fire off a mergePlatform action!
          const platformEntries = obj.registration.entries.filter(e => {
            return e.day === day && e.platform === platform;
          });
          props.mergePlatform(day, platform, platformEntries);
        }
      } catch (err) {
        error = "Couldn't parse JSON.";
      }

      if (error !== null) {
        window.alert(error);
      }
    };
    reader.readAsText(selectedFile);
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
        const lifted = liftedOnDay[j];
        const actionText = lifted === true ? "Export" : "Merge";
        const bsStyle = lifted === true ? "success" : "warning";
        buttons.push(
          <Button
            key={i + "-" + j}
            bsStyle={bsStyle}
            onClick={e => {
              lifted === true
                ? this.handleExportPlatformClick(i + 1, j + 1, e)
                : this.handleMergePlatformClick(i + 1, j + 1, e);
            }}
          >
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
          <Panel.Body>
            <div style={{ fontWeight: "bold" }}>Merging platforms will overwrite data. Please save before merging.</div>
            <br />
            {this.makePlatformMergeButtons()}
          </Panel.Body>
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

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    global: state
  };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    mergePlatform: (day, platform, platformEntries) => dispatch(mergePlatform(day, platform, platformEntries))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsView);
