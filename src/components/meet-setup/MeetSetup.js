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
import FormulaSelect from "./FormulaSelect";
import FederationSelect from "./FederationSelect";
import AutoFillRules from "./AutoFillRules";
import DivisionSelect from "./DivisionSelect";
import WeightClassesSelect from "./WeightClassesSelect";
import BarAndCollarsWeightKg from "./BarAndCollarsWeightKg";
import Plates from "./Plates";

import { updateMeet, setInKg } from "../../actions/meetSetupActions";

import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  allow4thAttempts: boolean;
  combineSleevesAndWraps: boolean;
  inKg: boolean;

  masterKey: string; // Used to force-update rules components on Auto-Fill.
}

interface DispatchProps {
  setCombineSleevesAndWraps: (event: Object) => void;
  setAllow4thAttempts: (event: Object) => void;
  setInKg: (event: Object) => void;
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
                <FormulaSelect key={this.props.masterKey + "-formula"} />

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
                <BarAndCollarsWeightKg key={inKg} />
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
  masterKey: state.meet.divisions.join()
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  setCombineSleevesAndWraps: event =>
    dispatch(updateMeet({ combineSleevesAndWraps: yesNoToBoolean(event.target.value) })),
  setAllow4thAttempts: event => dispatch(updateMeet({ allow4thAttempts: yesNoToBoolean(event.target.value) })),
  setInKg: event => dispatch(setInKg(yesNoToBoolean(event.target.value)))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetSetup);
