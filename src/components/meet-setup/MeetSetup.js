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
import { Grid, Col, Row, Panel, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

import MeetName from "./MeetName";
import MeetDate from "./MeetDate";
import MeetLength from "./MeetLength";
import MeetLocation from "./MeetLocation";
import PlatformCounts from "./PlatformCounts";
import FederationSelect from "./FederationSelect";
import AutoFillRules from "./AutoFillRules";
import DivisionSelect from "./DivisionSelect";
import WeightClassesSelect from "./WeightClassesSelect";
import BarAndCollarsWeightKg from "./BarAndCollarsWeightKg";
import Plates from "./Plates";

import { updateMeet, setInKg } from "../../actions/meetSetupActions";

import type { GlobalState } from "../../types/stateTypes";
import type { AgeCoefficients, Formula } from "../../types/dataTypes";

interface StateProps {
  allow4thAttempts: boolean;
  combineSleevesAndWraps: boolean;
  inKg: boolean;
  formula: Formula;
  ageCoefficients: AgeCoefficients;

  masterKey: string; // Used to force-update rules components on Auto-Fill.
}

interface DispatchProps {
  setCombineSleevesAndWraps: (event: Object) => void;
  setAllow4thAttempts: (event: Object) => void;
  setInKg: (event: Object) => void;
  setFormula: (event: Object) => void;
  setAgeCoefficients: (event: Object) => void;
}

type Props = StateProps & DispatchProps;

const yesNoBooleanOptions = [
  <option key="Yes" value="Yes">
    Yes
  </option>,
  <option key="No" value="No">
    No
  </option>
];

// The widgets speak strings, but the state speaks boolean.
const yesNoToBoolean = (yesno: string): boolean => {
  if (yesno === "Yes") return true;
  return false;
};
const yesNoFromBoolean = (bool: boolean): string => {
  if (bool === true) return "Yes";
  return "No";
};

class MeetSetup extends React.Component<Props> {
  render() {
    // This is used as a key to force unit-dependent components to re-initialize state.
    const inKg = String(this.props.inKg);

    return (
      <Grid>
        <Row>
          <Col md={4}>
            <Panel bsStyle="info">
              <Panel.Heading>Sanction Information</Panel.Heading>
              <Panel.Body>
                <MeetName />
                <MeetLocation />
                <FederationSelect />
                <MeetDate />
                <MeetLength />
                <PlatformCounts />
              </Panel.Body>
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <Panel.Heading>Competition Rules</Panel.Heading>
              <Panel.Body>
                <AutoFillRules />
                <DivisionSelect key={this.props.masterKey} />
                <WeightClassesSelect
                  sex="M"
                  label="Men's Weight Classes (kg), omit SHW"
                  key={this.props.masterKey + "-M"}
                />
                <WeightClassesSelect
                  sex="F"
                  label="Women's Weight Classes (kg), omit SHW"
                  key={this.props.masterKey + "-F"}
                />
                <WeightClassesSelect
                  sex="Mx"
                  label="Mx Weight Classes (kg), omit SHW"
                  key={this.props.masterKey + "-Mx"}
                />

                <FormGroup key={this.props.masterKey + "-formula"}>
                  <ControlLabel>Best Lifter Formula</ControlLabel>
                  <FormControl
                    componentClass="select"
                    defaultValue={this.props.formula}
                    onChange={this.props.setFormula}
                  >
                    <option value="Bodyweight Multiple">Bodyweight Multiple</option>
                    <option value="Dots">Dots</option>
                    <option value="Glossbrenner">Glossbrenner</option>
                    <option value="IPF Points">IPF Points</option>
                    <option value="NASA Points">NASA Points</option>
                    <option value="Schwartz/Malone">Schwartz/Malone</option>
                    <option value="Wilks">Wilks</option>
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-ageCoefficients"}>
                  <ControlLabel>Age Coefficients for Best Juniors/Masters Lifter</ControlLabel>
                  <FormControl
                    componentClass="select"
                    defaultValue={this.props.ageCoefficients}
                    onChange={this.props.setAgeCoefficients}
                  >
                    <option key="None" value="None">
                      None
                    </option>
                    <option key="FosterMcCulloch" value="FosterMcCulloch">
                      Foster-McCulloch
                    </option>
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-sleeves-wraps"}>
                  <ControlLabel>Should Sleeves and Wraps be combined for placing?</ControlLabel>
                  <FormControl
                    componentClass="select"
                    defaultValue={yesNoFromBoolean(this.props.combineSleevesAndWraps)}
                    onChange={this.props.setCombineSleevesAndWraps}
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-4th-attempts"}>
                  <ControlLabel>Can lifters take 4th attempts for records?</ControlLabel>
                  <FormControl
                    componentClass="select"
                    defaultValue={yesNoFromBoolean(this.props.allow4thAttempts)}
                    onChange={this.props.setAllow4thAttempts}
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>
              </Panel.Body>
            </Panel>
          </Col>

          <Col md={4}>
            <Panel bsStyle="info">
              <Panel.Heading>Weights and Loading Setup</Panel.Heading>
              <Panel.Body>
                <FormGroup>
                  <ControlLabel>In what units are attempts and bodyweights?</ControlLabel>
                  <FormControl
                    componentClass="select"
                    defaultValue={yesNoFromBoolean(this.props.inKg)}
                    onChange={this.props.setInKg}
                  >
                    <option key="Yes" value="Yes">
                      Kilograms
                    </option>
                    <option key="No" value="No">
                      Pounds
                    </option>
                  </FormControl>
                </FormGroup>
                <BarAndCollarsWeightKg key={"S" + inKg} lift="S" />
                <BarAndCollarsWeightKg key={"B" + inKg} lift="B" />
                <BarAndCollarsWeightKg key={"D" + inKg} lift="D" />
                <Plates />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  combineSleevesAndWraps: state.meet.combineSleevesAndWraps,
  allow4thAttempts: state.meet.allow4thAttempts,
  formula: state.meet.formula,
  ageCoefficients: state.meet.ageCoefficients,
  masterKey: state.meet.divisions.join()
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  setCombineSleevesAndWraps: event =>
    dispatch(updateMeet({ combineSleevesAndWraps: yesNoToBoolean(event.target.value) })),
  setAllow4thAttempts: event => dispatch(updateMeet({ allow4thAttempts: yesNoToBoolean(event.target.value) })),
  setInKg: event => dispatch(setInKg(yesNoToBoolean(event.target.value))),
  setFormula: event => dispatch(updateMeet({ formula: event.target.value })),
  setAgeCoefficients: event => dispatch(updateMeet({ ageCoefficients: event.target.value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetSetup);
