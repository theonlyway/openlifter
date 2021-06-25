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

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

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
import YesNoButton from "../common/YesNoButton";

import { getString } from "../../logic/strings";
import { updateMeet, setInKg } from "../../actions/meetSetupActions";

import { GlobalState, MeetState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import { assertString, assertFormula, assertAgeCoefficients } from "../../types/utils";
import { Language, Validation } from "../../types/dataTypes";

interface StateProps {
  meet: MeetState;
  language: Language;
}

interface DispatchProps {
  setMeetName: (name: string) => void;
  setCountry: (country: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setFederation: (fed: string) => void;
  setCombineSleevesAndWraps: (bool: boolean) => void;
  setCombineSingleAndMulti: (bool: boolean) => void;
  setAllow4thAttempts: (bool: boolean) => void;
  setInKg: (bool: boolean) => void;
  setShowAlternateUnits: (bool: boolean) => void;
  setFormula: (event: React.BaseSyntheticEvent) => void;
  setAgeCoefficients: (event: React.BaseSyntheticEvent) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  // This is a number used to derive a `key` for many widgets.
  // Incrementing the ticker can be used to force a re-render.
  // This is used to re-render things after the "Auto-Fill" button is pressed.
  ticker: number;
}

class MeetSetup extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ticker: 0,
    };
  }

  validateRequiredText = (value?: string): Validation => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  render() {
    // This is used as a key to force unit-dependent components to re-initialize state.
    const inKg = String(this.props.meet.inKg);
    const language = this.props.language;

    const stringMeetName = getString("meet-setup.meet-name", language);
    const stringFederation = getString("common.federation", language);
    const stringCountry = getString("common.country", language);
    const stringStateProvince = getString("meet-setup.state-province", language);
    const stringCityTown = getString("meet-setup.city-town", language);

    const stringKilograms = getString("common.kilograms", language);
    const stringPounds = getString("common.pounds", language);

    const stringMensClasses = getString("meet-setup.label-classes-men", language);
    const stringWomensClasses = getString("meet-setup.label-classes-women", language);
    const stringMxClasses = getString("meet-setup.label-classes-mx", language);

    const stringAH = getString("formula.ah", language);
    const stringBodyweightMultiple = getString("formula.bodyweight-multiple", language);
    const stringDots = getString("formula.dots", language);
    const stringGlossbrenner = getString("formula.glossbrenner", language);
    const stringIPFGLPoints = getString("formula.ipf-gl-points", language);
    const stringIPFPoints = getString("formula.ipf-points", language);
    const stringNASAPoints = getString("formula.nasa-points", language);
    // const stringReshel = getString("formula.reshel", language);
    const stringSchwartzMalone = getString("formula.schwartz-malone", language);
    const stringTotal = getString("formula.total", language);
    const stringWilks = getString("formula.wilks", language);
    const stringWilks2020 = getString("formula.wilks2020", language);
    const stringNone = getString("age-coefficients.none", language);
    const stringFosterMcCulloch = getString("age-coefficients.foster-mcculloch", language);
    const stringNo = getString("common.response-no", language);
    const stringYes = getString("common.response-yes", language);

    const stringAlsoKilograms = getString("meet-setup.label-also-show-kilograms", language);
    const stringAlsoPounds = getString("meet-setup.label-also-show-pounds", language);

    return (
      <Container>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header>
                <FormattedMessage id="meet-setup.header-sanction-info" defaultMessage="Sanction Information" />
              </Card.Header>
              <Card.Body>
                <ValidatedInput
                  label={stringMeetName}
                  placeholder={stringMeetName}
                  initialValue={this.props.meet.name}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setMeetName}
                  keepMargin={true}
                />
                <ValidatedInput
                  label={stringFederation}
                  placeholder={stringFederation}
                  initialValue={this.props.meet.federation}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setFederation}
                  keepMargin={true}
                />
                <ValidatedInput
                  label={stringCountry}
                  placeholder={stringCountry}
                  initialValue={this.props.meet.country}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setCountry}
                  keepMargin={true}
                />
                <ValidatedInput
                  label={stringStateProvince}
                  placeholder={stringStateProvince}
                  initialValue={this.props.meet.state}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setState}
                  keepMargin={true}
                />
                <ValidatedInput
                  label={stringCityTown}
                  placeholder={stringCityTown}
                  initialValue={this.props.meet.city}
                  validate={this.validateRequiredText}
                  onSuccess={this.props.setCity}
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
              <Card.Header>
                <FormattedMessage id="meet-setup.header-rules" defaultMessage="Competition Rules" />
              </Card.Header>
              <Card.Body>
                <AutoFillRules onChange={() => this.setState({ ticker: this.state.ticker + 1 })} />
                <DivisionSelect key={this.state.ticker + "-divselect"} />
                <WeightClassesSelect sex="M" label={stringMensClasses} key={this.state.ticker + "-M"} />
                <WeightClassesSelect sex="F" label={stringWomensClasses} key={this.state.ticker + "-F"} />
                <WeightClassesSelect sex="Mx" label={stringMxClasses} key={this.state.ticker + "-Mx"} />

                <FormGroup key={this.state.ticker + "-formula"}>
                  <Form.Label>
                    <FormattedMessage id="meet-setup.formula" defaultMessage="Best Lifter Formula" />
                  </Form.Label>
                  <FormControl
                    as="select"
                    value={this.props.meet.formula}
                    onChange={this.props.setFormula}
                    className="custom-select"
                  >
                    <option value="AH">{stringAH}</option>
                    <option value="Bodyweight Multiple">{stringBodyweightMultiple}</option>
                    <option value="Dots">{stringDots}</option>
                    <option value="Glossbrenner">{stringGlossbrenner}</option>
                    <option value="IPF GL Points">{stringIPFGLPoints}</option>
                    <option value="IPF Points">{stringIPFPoints}</option>
                    <option value="NASA Points">{stringNASAPoints}</option>
                    <option value="Schwartz/Malone">{stringSchwartzMalone}</option>
                    <option value="Total">{stringTotal}</option>
                    <option value="Wilks">{stringWilks}</option>
                    <option value="Wilks2020">{stringWilks2020}</option>
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.state.ticker + "-ageCoefficients"}>
                  <Form.Label>
                    <FormattedMessage
                      id="meet-setup.age-coefficients"
                      defaultMessage="Age Coefficients for Best Juniors/Masters Lifter"
                    />
                  </Form.Label>
                  <FormControl
                    as="select"
                    value={this.props.meet.ageCoefficients}
                    onChange={this.props.setAgeCoefficients}
                    className="custom-select"
                  >
                    <option key="None" value="None">
                      {stringNone}
                    </option>
                    <option key="FosterMcCulloch" value="FosterMcCulloch">
                      {stringFosterMcCulloch}
                    </option>
                  </FormControl>
                </FormGroup>

                <FormGroup key={this.state.ticker + "-sleeves-wraps"}>
                  <YesNoButton
                    label={
                      <FormattedMessage
                        id="meet-setup.combine-sleeves-wraps"
                        defaultMessage="Should Sleeves and Wraps be combined for placing?"
                      />
                    }
                    value={this.props.meet.combineSleevesAndWraps}
                    setValue={this.props.setCombineSleevesAndWraps}
                    yes={stringYes}
                    no={stringNo}
                  />
                </FormGroup>

                <FormGroup key={this.state.ticker + "-single-multi"}>
                  <YesNoButton
                    label={
                      <FormattedMessage
                        id="meet-setup.combine-single-multi"
                        defaultMessage="Should Single-ply and Multi-ply be combined for placing?"
                      />
                    }
                    value={this.props.meet.combineSingleAndMulti}
                    setValue={this.props.setCombineSingleAndMulti}
                    yes={stringYes}
                    no={stringNo}
                  />
                </FormGroup>

                <FormGroup key={this.state.ticker + "-4th-attempts"}>
                  <YesNoButton
                    label={
                      <FormattedMessage
                        id="meet-setup.allow-4th-attempts"
                        defaultMessage="Can lifters take 4th attempts for records?"
                      />
                    }
                    value={this.props.meet.allow4thAttempts}
                    setValue={this.props.setAllow4thAttempts}
                    yes={stringYes}
                    no={stringNo}
                  />
                </FormGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <FormattedMessage id="meet-setup.header-loading" defaultMessage="Weights and Loading" />
              </Card.Header>
              <Card.Body>
                <FormGroup>
                  <YesNoButton
                    label={
                      <FormattedMessage
                        id="meet-setup.units"
                        defaultMessage="In what units are attempts and bodyweights?"
                      />
                    }
                    value={this.props.meet.inKg}
                    setValue={this.props.setInKg}
                    yes={stringKilograms}
                    no={stringPounds}
                  />
                </FormGroup>

                <FormGroup>
                  <YesNoButton
                    label={this.props.meet.inKg ? stringAlsoPounds : stringAlsoKilograms}
                    value={this.props.meet.showAlternateUnits}
                    setValue={this.props.setShowAlternateUnits}
                    yes={stringYes}
                    no={stringNo}
                  />
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
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  setMeetName: (name: string) => dispatch(updateMeet({ name: name })),
  setCountry: (country: string) => dispatch(updateMeet({ country: country })),
  setState: (state: string) => dispatch(updateMeet({ state: state })),
  setCity: (city: string) => dispatch(updateMeet({ city: city })),
  setFederation: (fed: string) => dispatch(updateMeet({ federation: fed })),
  setCombineSleevesAndWraps: (bool) => dispatch(updateMeet({ combineSleevesAndWraps: bool })),
  setCombineSingleAndMulti: (bool) => dispatch(updateMeet({ combineSingleAndMulti: bool })),
  setAllow4thAttempts: (bool) => dispatch(updateMeet({ allow4thAttempts: bool })),
  setInKg: (bool) => dispatch(setInKg(bool)),
  setShowAlternateUnits: (bool) => dispatch(updateMeet({ showAlternateUnits: bool })),
  setFormula: (event) =>
    assertString(event.currentTarget.value) &&
    assertFormula(event.currentTarget.value) &&
    dispatch(updateMeet({ formula: event.currentTarget.value })),
  setAgeCoefficients: (event) =>
    assertString(event.currentTarget.value) &&
    assertAgeCoefficients(event.currentTarget.value) &&
    dispatch(updateMeet({ ageCoefficients: event.currentTarget.value })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetSetup);
