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

const gpcausDefaults: $Shape<MeetState> = {
  divisions: [
    "F-JE",
    "F-JR",
    "F-M1E",
    "F-M1R",
    "F-M2E",
    "F-M2R",
    "F-M3E",
    "F-M3R",
    "F-M4E",
    "F-M4R",
    "F-M5E",
    "F-M5R",
    "F-M6E",
    "F-M6R",
    "F-M7E",
    "F-M7R",
    "F-M8E",
    "F-M8R",
    "F-M9E",
    "F-M9R",
    "F-OE",
    "F-OR",
    "F-T1E",
    "F-T1R",
    "F-T2E",
    "F-T2R",
    "F-T3E",
    "F-T3R",
    "M-JE",
    "M-JR",
    "M-M1E",
    "M-M1R",
    "M-M2E",
    "M-M2R",
    "M-M3E",
    "M-M3R",
    "M-M4E",
    "M-M4R",
    "M-M5E",
    "M-M5R",
    "M-M6E",
    "M-M6R",
    "M-M7E",
    "M-M7R",
    "M-M8E",
    "M-M8R",
    "M-M9E",
    "M-M9R",
    "M-OE",
    "M-OR",
    "M-T1E",
    "M-T1R",
    "M-T2E",
    "M-T2R",
    "M-T3E",
    "M-T3R"
  ],
  weightClassesKgMen: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 110],
  weightClassesKgMx: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Glossbrenner",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  allow4thAttempts: true
};

const upaDefaults: $Shape<MeetState> = {
  divisions: [
    "FG",
    "FG-AD",
    "FGR",
    "FGR-AD",
    "FJ",
    "FJ-AD",
    "FJR",
    "FJR-AD",
    "FJRE",
    "FJRE-AD",
    "FM1",
    "FM1-AD",
    "FM1R",
    "FM1R-AD",
    "FM1RE",
    "FM1RE-AD",
    "FM2",
    "FM2-AD",
    "FM2R",
    "FM2R-AD",
    "FM2RE",
    "FM2RE-AD",
    "FM3",
    "FM3-AD",
    "FM3R",
    "FM3R-AD",
    "FM3RE",
    "FM3RE-AD",
    "FM4",
    "FM4-AD",
    "FM4R",
    "FM4R-AD",
    "FM4RE",
    "FM4RE-AD",
    "FM5",
    "FM5-AD",
    "FM5R",
    "FM5R-AD",
    "FM5RE",
    "FM5RE-AD",
    "FM6",
    "FM6-AD",
    "FM6R",
    "FM6R-AD",
    "FM6RE",
    "FM6RE-AD",
    "FM7",
    "FM7-AD",
    "FM7R",
    "FM7R-AD",
    "FM7RE",
    "FM7RE-AD",
    "FM8",
    "FM8-AD",
    "FM8R",
    "FM8R-AD",
    "FM8RE",
    "FM8RE-AD",
    "FM9",
    "FM9-AD",
    "FM9R",
    "FM9R-AD",
    "FM9RE",
    "FM9RE-AD",
    "FMX",
    "FMX-AD",
    "FMXR",
    "FMXR-AD",
    "FMXRE",
    "FMXRE-AD",
    "FO",
    "FO-AD",
    "FOR",
    "FOR-AD",
    "FORE",
    "FORE-AD",
    "FPFR",
    "FPFR-AD",
    "FS",
    "FS-AD",
    "FSR",
    "FSR-AD",
    "FSRE",
    "FSRE-AD",
    "FT1",
    "FT1-AD",
    "FT1R",
    "FT1R-AD",
    "FT1RE",
    "FT1RE-AD",
    "FT2",
    "FT2-AD",
    "FT2R",
    "FT2R-AD",
    "FT2RE",
    "FT2RE-AD",
    "FT3",
    "FT3-AD",
    "FT3R",
    "FT3R-AD",
    "FT3RE",
    "FT3RE-AD",
    "FTX",
    "FTX-AD",
    "FTXR",
    "FTXR-AD",
    "FTXRE",
    "FTXRE-AD",
    "MG",
    "MG-AD",
    "MGR",
    "MGR-AD",
    "MJ",
    "MJ-AD",
    "MJR",
    "MJR-AD",
    "MJRE",
    "MJRE-AD",
    "MM1",
    "MM1-AD",
    "MM1R",
    "MM1R-AD",
    "MM1RE",
    "MM1RE-AD",
    "MM2",
    "MM2-AD",
    "MM2R",
    "MM2R-AD",
    "MM2RE",
    "MM2RE-AD",
    "MM3",
    "MM3-AD",
    "MM3R",
    "MM3R-AD",
    "MM3RE",
    "MM3RE-AD",
    "MM4",
    "MM4-AD",
    "MM4R",
    "MM4R-AD",
    "MM4RE",
    "MM4RE-AD",
    "MM5",
    "MM5-AD",
    "MM5R",
    "MM5R-AD",
    "MM5RE",
    "MM5RE-AD",
    "MM6",
    "MM6-AD",
    "MM6R",
    "MM6R-AD",
    "MM6RE",
    "MM6RE-AD",
    "MM7",
    "MM7-AD",
    "MM7R",
    "MM7R-AD",
    "MM7RE",
    "MM7RE-AD",
    "MM8",
    "MM8-AD",
    "MM8R",
    "MM8R-AD",
    "MM8RE",
    "MM8RE-AD",
    "MM9",
    "MM9-AD",
    "MM9R",
    "MM9R-AD",
    "MM9RE",
    "MM9RE-AD",
    "MMX",
    "MMX-AD",
    "MMXR",
    "MMXR-AD",
    "MMXRE",
    "MMXRE-AD",
    "MO",
    "MO-AD",
    "MOR",
    "MOR-AD",
    "MORE",
    "MORE-AD",
    "MPFR",
    "MPFR-AD",
    "MS",
    "MS-AD",
    "MSR",
    "MSR-AD",
    "MSRE",
    "MSRE-AD",
    "MT1",
    "MT1-AD",
    "MT1R",
    "MT1R-AD",
    "MT1RE",
    "MT1RE-AD",
    "MT2",
    "MT2-AD",
    "MT2R",
    "MT2R-AD",
    "MT2RE",
    "MT2RE-AD",
    "MT3",
    "MT3-AD",
    "MT3R",
    "MT3R-AD",
    "MT3RE",
    "MT3RE-AD",
    "MTX",
    "MTX-AD",
    "MTXR",
    "MTXR-AD",
    "MTXRE",
    "MTXRE-AD"
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Schwartz/Malone",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
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
      case "GPC-AUS":
        this.props.updateMeet(gpcausDefaults);
        return;
      case "UPA":
        this.props.updateMeet(upaDefaults);
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
              <option key="GPC-AUS" value="GPC-AUS">
                GPC-AUS Rules
              </option>
              <option key="UPA" value="UPA">
                UPA Rules
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
