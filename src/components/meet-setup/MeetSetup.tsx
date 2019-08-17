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

import React, { FormEvent } from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";

import ValidatedInput from "../ValidatedInput";

import MeetDate from "./MeetDate";
import MeetLength from "./MeetLength";
import PlatformCounts from "./PlatformCounts";
import AutoFillRules from "./AutoFillRules";
import DivisionSelect from "./DivisionSelect";
import WeightClassesSelect from "./WeightClassesSelect";
import BarAndCollarsWeightKg from "./BarAndCollarsWeightKg";
import Plates from "./Plates";

import { updateMeet, setInKg } from "../../actions/meetSetupActions";

import { GlobalState, MeetState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import { FormControlTypeHack, assertString, assertFormula, assertAgeCoefficients } from "../../types/utils";
import { AgeCoefficients, Formula, Validation } from "../../types/dataTypes";

interface StateProps {
  meet: MeetState;
  masterKey: string; // Used to force-update rules components on Auto-Fill.
}

interface DispatchProps {
  setMeetName: (name: string) => void;
  setCountry: (country: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setFederation: (fed: string) => void;
  setCombineSleevesAndWraps: (event: FormEvent<FormControlTypeHack>) => void;
  setAllow4thAttempts: (event: FormEvent<FormControlTypeHack>) => void;
  setInKg: (event: FormEvent<FormControlTypeHack>) => void;
  setShowAlternateUnits: (event: FormEvent<FormControlTypeHack>) => void;
  setFormula: (event: FormEvent<FormControlTypeHack>) => void;
  setAgeCoefficients: (event: FormEvent<FormControlTypeHack>) => void;
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
  validateRequiredText = (value?: string): Validation => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  render() {
    // This is used as a key to force unit-dependent components to re-initialize state.
    const inKg = String(this.props.meet.inKg);

    return (
      <Container>
        <Row>
          <Col md={4}>
            <Card border="info">
              <Card.Header>Sanction Information</Card.Header>
              <Card.Body>
                <ValidatedInput
                  label="Meet Name"
                  placeholder="Meet Name"
                  initialValue={this.props.meet.name}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setMeetName}
                  keepMargin={true}
                />
                <ValidatedInput
                  label="Country"
                  placeholder="Country"
                  initialValue={this.props.meet.country}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setCountry}
                  keepMargin={true}
                />
                <ValidatedInput
                  label="State/Province"
                  placeholder="State/Province"
                  initialValue={this.props.meet.state}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setState}
                  keepMargin={true}
                />
                <ValidatedInput
                  label="City/Town"
                  placeholder="City/Town"
                  initialValue={this.props.meet.city}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setCity}
                  keepMargin={true}
                />
                <ValidatedInput
                  label="Federation"
                  placeholder="Federation"
                  initialValue={this.props.meet.federation}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setFederation}
                  keepMargin={true}
                />
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
                  <FormControl
                    as="select"
                    defaultValue={this.props.meet.formula}
                    onChange={this.props.setFormula}
                    className="custom-select"
                  >
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
                    defaultValue={this.props.meet.ageCoefficients}
                    onChange={this.props.setAgeCoefficients}
                    className="custom-select"
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
                    defaultValue={yesNoFromBoolean(this.props.meet.combineSleevesAndWraps)}
                    onChange={this.props.setCombineSleevesAndWraps}
                    className="custom-select"
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.props.masterKey + "-4th-attempts"}>
                  <Form.Label>Can lifters take 4th attempts for records?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.meet.allow4thAttempts)}
                    onChange={this.props.setAllow4thAttempts}
                    className="custom-select"
                  >
                    {yesNoBooleanOptions}
                  </FormControl>
                </FormGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card border="info">
              <Card.Header>Weights and Loading Setup</Card.Header>
              <Card.Body>
                <FormGroup>
                  <Form.Label>In what units are attempts and bodyweights?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.meet.inKg)}
                    onChange={this.props.setInKg}
                    className="custom-select"
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
                  <Form.Label>Also show attempts in {this.props.meet.inKg ? "pounds" : "kilograms"}?</Form.Label>
                  <FormControl
                    as="select"
                    defaultValue={yesNoFromBoolean(this.props.meet.showAlternateUnits)}
                    onChange={this.props.setShowAlternateUnits}
                    className="custom-select"
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
  meet: state.meet,
  masterKey: state.meet.divisions.join()
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  setMeetName: (name: string) => dispatch(updateMeet({ name: name })),
  setCountry: (country: string) => dispatch(updateMeet({ country: country })),
  setState: (state: string) => dispatch(updateMeet({ state: state })),
  setCity: (city: string) => dispatch(updateMeet({ city: city })),
  setFederation: (fed: string) => dispatch(updateMeet({ federation: fed })),
  setCombineSleevesAndWraps: event =>
    assertString(event.currentTarget.value) &&
    dispatch(updateMeet({ combineSleevesAndWraps: yesNoToBoolean(event.currentTarget.value) })),
  setAllow4thAttempts: event =>
    assertString(event.currentTarget.value) &&
    dispatch(updateMeet({ allow4thAttempts: yesNoToBoolean(event.currentTarget.value) })),
  setInKg: event =>
    assertString(event.currentTarget.value) && dispatch(setInKg(yesNoToBoolean(event.currentTarget.value))),
  setShowAlternateUnits: event =>
    assertString(event.currentTarget.value) &&
    dispatch(updateMeet({ showAlternateUnits: yesNoToBoolean(event.currentTarget.value) })),
  setFormula: event =>
    assertString(event.currentTarget.value) &&
    assertFormula(event.currentTarget.value) &&
    dispatch(updateMeet({ formula: event.currentTarget.value })),
  setAgeCoefficients: event =>
    assertString(event.currentTarget.value) &&
    assertAgeCoefficients(event.currentTarget.value) &&
    dispatch(updateMeet({ ageCoefficients: event.currentTarget.value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetSetup);
