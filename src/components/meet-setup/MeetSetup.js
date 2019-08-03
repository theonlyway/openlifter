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

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";

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
  showAlternateUnits: boolean;
  formula: Formula;
  ageCoefficients: AgeCoefficients;

  masterKey: string; // Used to force-update rules components on Auto-Fill.
}

interface DispatchProps {
  setCombineSleevesAndWraps: (event: Object) => void;
  setAllow4thAttempts: (event: Object) => void;
  setInKg: (event: Object) => void;
  setShowAlternateUnits: (event: Object) => void;
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
      <Container>
        <Row>
          <Col md={4}>
            <Card variant="info">
              <Card.Header>Sanction Information</Card.Header>
              <Card.Body>
                <MeetName />
                <MeetLocation />
                <FederationSelect />
                <MeetDate />
                <MeetLength />
                <PlatformCounts />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>Competition Rules</Card.Header>
              <Card.Body>
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
                  <Form.Label>Best Lifter Formula</Form.Label>
                  <FormControl as="select" defaultValue={this.props.formula} onChange={this.props.setFormula}>
                    <option value="Bodyweight Multiple">Bodyweight Multiple</option>
                    <option value="Dots">Dots</option>
                    <option value="Glossbrenner">Glossbrenner</option>
                    <option value="IPF Points">IPF Points</option>
                    <option value="NASA Points">NASA Points</option>
                    <option value="Schwartz/Malone">Schwartz/Malone</option>
                    <option value="Total">Total</option>
                    <option value="Wilks">Wilks</option>
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-ageCoefficients"}>
                  <Form.Label>Age Coefficients for Best Juniors/Masters Lifter</Form.Label>
                  <FormControl
                    as="select"
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
                  <Form.Label>Should Sleeves and Wraps be combined for placing?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.combineSleevesAndWraps)}
                    onChange={this.props.setCombineSleevesAndWraps}
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-4th-attempts"}>
                  <Form.Label>Can lifters take 4th attempts for records?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.allow4thAttempts)}
                    onChange={this.props.setAllow4thAttempts}
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card variant="info">
              <Card.Header>Weights and Loading Setup</Card.Header>
              <Card.Body>
                <FormGroup>
                  <Form.Label>In what units are attempts and bodyweights?</Form.Label>
                  <FormControl
                    as="select"
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

                <FormGroup>
                  <Form.Label>Also show attempts in {this.props.inKg ? "pounds" : "kilograms"}?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.showAlternateUnits)}
                    onChange={this.props.setShowAlternateUnits}
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>

                <BarAndCollarsWeightKg key={"S" + inKg} lift="S" />
                <BarAndCollarsWeightKg key={"B" + inKg} lift="B" />
                <BarAndCollarsWeightKg key={"D" + inKg} lift="D" />
                <Plates />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  showAlternateUnits: state.meet.showAlternateUnits,
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
  setShowAlternateUnits: event => dispatch(updateMeet({ showAlternateUnits: yesNoToBoolean(event.target.value) })),
  setFormula: event => dispatch(updateMeet({ formula: event.target.value })),
  setAgeCoefficients: event => dispatch(updateMeet({ ageCoefficients: event.target.value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetSetup);
