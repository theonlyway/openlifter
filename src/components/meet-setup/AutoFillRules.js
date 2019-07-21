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

// Provides widgets that overwrite rules with federation defaults.

import React from "react";
import { connect } from "react-redux";

import { Button, ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import { updateMeet } from "../../actions/meetSetupActions";

import type { GlobalState, MeetState } from "../../types/stateTypes";

interface StateProps {
  federation: string;
}

interface DispatchProps {
  updateMeet: (changes: $Shape<MeetState>) => void;
}

type Props = StateProps & DispatchProps;

type AutoFillOption = "Traditional" | "USAPL";

interface InternalState {
  selectedOption: AutoFillOption;
}

const traditionalDefaults: $Shape<MeetState> = {
  divisions: [
    "Open",
    "Youth",
    "T13-15",
    "T16-17",
    "T18-19",
    "J20-23",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+"
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: true
};

const usaplDefaults: $Shape<MeetState> = {
  divisions: [
    "MR-O",
    "MR-Y",
    "MR-Y1",
    "MR-Y2",
    "MR-Y3",
    "MR-T1",
    "MR-T2",
    "MR-T3",
    "MR-Jr",
    "MR-M1a",
    "MR-M1b",
    "MR-M2a",
    "MR-M2b",
    "MR-M3a",
    "MR-M3b",
    "MR-M4a",
    "MR-M4b",
    "MR-M5a",
    "MR-M5b",
    "MR-M6a",
    "MR-M6b",
    "MR-G",
    "M-O",
    "M-Y",
    "M-Y1",
    "M-Y2",
    "M-Y3",
    "M-T1",
    "M-T2",
    "M-T3",
    "M-Jr",
    "M-M1a",
    "M-M1b",
    "M-M2a",
    "M-M2b",
    "M-M3a",
    "M-M3b",
    "M-M4a",
    "M-M4b",
    "M-M5a",
    "M-M5b",
    "M-M6a",
    "M-M6b",
    "M-G",
    "FR-O",
    "FR-Y",
    "FR-Y1",
    "FR-Y2",
    "FR-Y3",
    "FR-T1",
    "FR-T2",
    "FR-T3",
    "FR-Jr",
    "FR-M1a",
    "FR-M1b",
    "FR-M2a",
    "FR-M2b",
    "FR-M3a",
    "FR-M3b",
    "FR-M4a",
    "FR-M4b",
    "FR-M5a",
    "FR-M5b",
    "FR-M6a",
    "FR-M6b",
    "FR-G",
    "F-O",
    "F-Y",
    "F-Y1",
    "F-Y2",
    "F-Y3",
    "F-T1",
    "F-T2",
    "F-T3",
    "F-Jr",
    "F-M1a",
    "F-M1b",
    "F-M2a",
    "F-M2b",
    "F-M3a",
    "F-M3b",
    "F-M4a",
    "F-M4b",
    "F-M5a",
    "F-M5b",
    "F-M6a",
    "F-M6b",
    "F-G"
  ],
  weightClassesKgMen: [53, 59, 66, 74, 83, 93, 105, 120],
  weightClassesKgWomen: [43, 47, 52, 57, 63, 72, 84],
  weightClassesKgMx: [53, 59, 66, 74, 83, 93, 105, 120],
  formula: "IPF Points",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: false
};

const uspaDefaults: $Shape<MeetState> = {
  divisions: [
    "Open",
    "Y4-12",
    "J13-15",
    "J16-17",
    "J18-19",
    "J20-23",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+"
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: true
};

const wabdlDefaults: $Shape<MeetState> = {
  divisions: [
    "Open",
    "T12-13",
    "T14-15",
    "T16-17",
    "T18-19",
    "J20-25",
    "S33-39",
    "M40-46",
    "M47-53",
    "M54-60",
    "M61-67",
    "M68-74",
    "M75-79",
    "M80-84",
    "M85-89",
    "M90+"
  ],
  weightClassesKgMen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 117.5, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100],
  weightClassesKgMx: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 117.5, 125, 140],
  formula: "Schwartz/Malone",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: true
};

const wrpfDefaults: $Shape<MeetState> = {
  divisions: [
    "Open",
    "Y5-13",
    "T14-16",
    "S17-19",
    "J20-23",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+"
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  allow4thAttempts: true
};

class AutoFillRules extends React.Component<Props, InternalState> {
  constructor(props, context) {
    super(props, context);

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      selectedOption: "Traditional"
    };
  }

  handleSelectChange = event => {
    this.setState({ selectedOption: event.target.value });
  };

  handleClick = event => {
    switch (this.state.selectedOption) {
      case "Traditional":
        this.props.updateMeet(traditionalDefaults);
        return;
      case "USAPL":
        this.props.updateMeet(usaplDefaults);
        return;
      case "USPA":
        this.props.updateMeet(uspaDefaults);
        return;
      case "WABDL":
        this.props.updateMeet(wabdlDefaults);
        return;
      case "WRPF":
        this.props.updateMeet(wrpfDefaults);
        return;
      default:
        (this.state.selectedOption: empty); // eslint-disable-line
        return;
    }
  };

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Auto-Fill Rules</ControlLabel>
          <div>
            <FormControl
              componentClass="select"
              onChange={this.handleSelectChange}
              defaultValue={this.state.selectedOption}
              style={{ width: "70%", display: "inline-block" }}
            >
              <option key="Traditional" value="Traditional">
                Traditional Rules
              </option>
              <option key="USAPL" value="USAPL">
                USAPL Rules
              </option>
              <option key="USPA" value="USPA">
                USPA Rules
              </option>
              <option key="WABDL" value="WABDL">
                WABDL Rules
              </option>
              <option key="WRPF" value="WRPF">
                WRPF Rules
              </option>
            </FormControl>

            <Button onClick={this.handleClick} bsStyle="primary" style={{ width: "25%", marginLeft: "5%" }}>
              Auto-Fill
            </Button>
          </div>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  federation: state.meet.federation
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    updateMeet: changes => dispatch(updateMeet(changes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoFillRules);
