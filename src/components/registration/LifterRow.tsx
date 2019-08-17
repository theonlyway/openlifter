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

// Defines a row in the LifterTable on the Registration page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import Select from "react-select";

import ValidatedInput from "../ValidatedInput";

import { validateIso8601Date } from "../../validation/iso8601Date";

import { deleteRegistration, updateRegistration } from "../../actions/registrationActions";
import { FormControlTypeHack, checkExhausted, assertString, assertFlight, assertSex } from "../../types/utils";
import { ActionMeta } from "react-select/lib/types";
import { Entry, Equipment } from "../../types/dataTypes";
import { Dispatch } from "redux";
import { GlobalState } from "../../types/stateTypes";

const eventOptions = [
  { value: "S", label: "S" },
  { value: "B", label: "B" },
  { value: "D", label: "D" },
  { value: "BD", label: "BD" },
  { value: "SBD", label: "SBD" },
  { value: "SB", label: "SB" },
  { value: "SD", label: "SD" }
];

interface OwnProps {
  id: number;
}

interface State {
  selectedDay: number;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class LifterRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Store the Day in state to update the Platform options when the Day changes.
    // Store the Birth Date in state to re-render when a new date is selected
    this.state = {
      selectedDay: props.entry.day
    };

    this.deleteRegistrationClick = this.deleteRegistrationClick.bind(this);
    this.updateRegistrationDay = this.updateRegistrationDay.bind(this);
    this.updateRegistrationPlatform = this.updateRegistrationPlatform.bind(this);
    this.updateRegistrationFlight = this.updateRegistrationFlight.bind(this);
    this.updateRegistrationName = this.updateRegistrationName.bind(this);
    this.updateRegistrationSex = this.updateRegistrationSex.bind(this);
    this.updateRegistrationLot = this.updateRegistrationLot.bind(this);
    this.updateRegistrationMemberId = this.updateRegistrationMemberId.bind(this);
    this.updateRegistrationBirthDate = this.updateRegistrationBirthDate.bind(this);
    this.updateRegistrationCountry = this.updateRegistrationCountry.bind(this);
    this.updateRegistrationState = this.updateRegistrationState.bind(this);
    this.updateRegistrationDivisions = this.updateRegistrationDivisions.bind(this);
    this.updateRegistrationEvents = this.updateRegistrationEvents.bind(this);
    this.updateRegistrationEquipment = this.updateRegistrationEquipment.bind(this);
    this.updateRegistrationTeam = this.updateRegistrationTeam.bind(this);
    this.updateRegistrationInstagram = this.updateRegistrationInstagram.bind(this);
    this.updateRegistrationNotes = this.updateRegistrationNotes.bind(this);
  }

  deleteRegistrationClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.props.deleteRegistration(this.props.id);
  }

  updateRegistrationDay(event: React.FormEvent<FormControlTypeHack>) {
    const day = Number(event.currentTarget.value);
    const entry = this.props.entry;

    // Also check whether the platform is now impossible.
    let platform = entry.platform;
    if (platform > this.props.meet.platformsOnDays[day - 1]) {
      platform = 1; // This matches the default behavior of the select element.
    }

    if (entry.day !== day) {
      this.setState({ selectedDay: day });
      this.props.updateRegistration(this.props.id, { day: day, platform: platform });
    }
  }

  updateRegistrationPlatform(event: React.FormEvent<FormControlTypeHack>) {
    const platform = Number(event.currentTarget.value);
    if (this.props.entry.platform !== platform) {
      this.props.updateRegistration(this.props.id, { platform: platform });
    }
  }

  updateRegistrationFlight(event: React.FormEvent<FormControlTypeHack>) {
    const value = event.currentTarget.value;
    if (this.props.entry.flight !== value && assertString(value) && assertFlight(value)) {
      this.props.updateRegistration(this.props.id, { flight: value });
    }
  }

  updateRegistrationName(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.value;
    if (this.props.entry.name !== name && assertString(name)) {
      this.props.updateRegistration(this.props.id, { name: name });
    }
  }

  updateRegistrationSex(event: React.FormEvent<FormControlTypeHack>) {
    const sex = event.currentTarget.value;
    if (this.props.entry.sex !== sex && assertString(sex) && assertSex(sex)) {
      this.props.updateRegistration(this.props.id, { sex: sex });
    }
  }

  updateRegistrationLot = (lot: string) => {
    const asNumber = Number(lot);
    if (asNumber >= 0 && asNumber !== this.props.entry.lot) {
      this.props.updateRegistration(this.props.id, { lot: asNumber });
    }
  };

  updateRegistrationMemberId = (event: React.FocusEvent<HTMLInputElement>) => {
    const memberId = event.target.value;
    if (this.props.entry.memberId !== memberId && typeof memberId === "string") {
      this.props.updateRegistration(this.props.id, { memberId: memberId });
    }
  };

  updateRegistrationBirthDate = (birthDate: string) => {
    if (this.props.entry.birthDate !== birthDate) {
      this.props.updateRegistration(this.props.id, { birthDate: birthDate });
    }
  };

  updateRegistrationCountry = (country: string) => {
    if (this.props.entry.country !== country) {
      this.props.updateRegistration(this.props.id, { country: country });
    }
  };

  updateRegistrationState = (state: string) => {
    if (this.props.entry.state !== state) {
      this.props.updateRegistration(this.props.id, { state: state });
    }
  };

  updateRegistrationDivisions(value: any, actionMeta: ActionMeta) {
    // Value is an array of { value, label } objects.
    // Since updates are synchronous, we can just compare lengths.
    if (value.length !== this.props.entry.divisions.length) {
      let divisions = [];
      for (let i = 0; i < value.length; i++) {
        divisions.push(value[i].label);
      }
      this.props.updateRegistration(this.props.id, { divisions: divisions });
    }
  }

  updateRegistrationEvents(value: any, actionMeta: ActionMeta) {
    // Value is an array of { value, label } objects.
    // Since updates are synchronous, we can just compare lengths.
    if (value.length !== this.props.entry.events.length) {
      let events = [];
      for (let i = 0; i < value.length; i++) {
        events.push(value[i].label);
      }
      this.props.updateRegistration(this.props.id, { events: events });
    }
  }

  updateRegistrationEquipment(event: React.FormEvent<FormControlTypeHack>) {
    const equipment = event.currentTarget.value as Equipment;
    if (this.props.entry.equipment !== equipment) {
      // Ensure value is something we expect & assist the compiler in helping us
      switch (equipment) {
        case "Bare":
        case "Sleeves":
        case "Wraps":
        case "Single-ply":
        case "Multi-ply":
          this.props.updateRegistration(this.props.id, { equipment: equipment });
          break;
        default:
          checkExhausted(equipment);
          break;
      }
    }
  }

  updateRegistrationTeam = (event: React.FocusEvent<HTMLInputElement>) => {
    if (assertString(event.target.value)) {
      this.props.updateRegistration(this.props.id, { team: event.target.value });
    }
  };

  updateRegistrationInstagram = (event: React.FocusEvent<HTMLInputElement>) => {
    if (assertString(event.target.value)) {
      this.props.updateRegistration(this.props.id, { instagram: event.target.value });
    }
  };

  updateRegistrationNotes = (event: React.FocusEvent<HTMLInputElement>) => {
    if (assertString(event.target.value)) {
      this.props.updateRegistration(this.props.id, { notes: event.target.value });
    }
  };

  render() {
    const entry = this.props.entry;

    let dayOptions = [];
    for (let i = 1; i <= this.props.meet.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    let platformOptions = [];
    for (let i = 1; i <= this.props.meet.platformsOnDays[entry.day - 1]; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    let divisionOptions = [];
    for (let i = 0; i < this.props.meet.divisions.length; i++) {
      let division = this.props.meet.divisions[i];
      divisionOptions.push({ value: division, label: division });
    }

    let selectedDivisions = [];
    for (let i = 0; i < entry.divisions.length; i++) {
      const division = entry.divisions[i];
      selectedDivisions.push({ value: division, label: division });
    }

    let selectedEvents = [];
    for (let i = 0; i < entry.events.length; i++) {
      const events = entry.events[i];
      selectedEvents.push({ value: events, label: events });
    }

    const gridStyle = { padding: "0px", margin: "0px" };

    return (
      <Card>
        <Card.Header style={{ display: "flex" }}>
          <Form.Control type="text" placeholder="Name" defaultValue={entry.name} onBlur={this.updateRegistrationName} />
          <Button onClick={this.deleteRegistrationClick} variant="danger" style={{ marginLeft: "15px" }}>
            Delete
          </Button>
        </Card.Header>
        <Card.Body>
          <Container style={gridStyle}>
            <Row>
              {/* Day */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>Day</Form.Label>
                  <Form.Control
                    defaultValue={this.state.selectedDay}
                    as="select"
                    onChange={this.updateRegistrationDay}
                    className="custom-select"
                  >
                    {dayOptions}
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Platform */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>Platform</Form.Label>
                  <Form.Control
                    defaultValue={entry.platform}
                    as="select"
                    onChange={this.updateRegistrationPlatform}
                    className="custom-select"
                  >
                    {platformOptions}
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Flight */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>Flight</Form.Label>
                  <Form.Control
                    defaultValue={entry.flight}
                    as="select"
                    onChange={this.updateRegistrationFlight}
                    className="custom-select"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Sex */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>Sex</Form.Label>
                  <Form.Control
                    defaultValue={entry.sex}
                    as="select"
                    onChange={this.updateRegistrationSex}
                    className="custom-select"
                  >
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Mx">Mx</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Equipment */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Equipment</Form.Label>
                  <Form.Control
                    defaultValue={entry.equipment}
                    as="select"
                    onChange={this.updateRegistrationEquipment}
                    className="custom-select"
                  >
                    <option value="Bare">Bare</option>
                    <option value="Sleeves">Sleeves</option>
                    <option value="Wraps">Wraps</option>
                    <option value="Single-ply">Single-ply</option>
                    <option value="Multi-ply">Multi-ply</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Divisions */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Divisions</Form.Label>
                  <Select
                    menuPlacement="auto"
                    options={divisionOptions}
                    isClearable={false}
                    isMulti={true}
                    onChange={this.updateRegistrationDivisions}
                    defaultValue={selectedDivisions}
                  />
                </Form.Group>
              </Col>

              {/* Events */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Events</Form.Label>
                  <Select
                    menuPlacement="auto"
                    options={eventOptions}
                    isClearable={false}
                    isMulti={true}
                    onChange={this.updateRegistrationEvents}
                    defaultValue={selectedEvents}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Container style={gridStyle}>
            <Row>
              {/* Date of Birth */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <ValidatedInput
                    initialValue={entry.birthDate}
                    placeholder="YYYY-MM-DD"
                    validate={validateIso8601Date}
                    onSuccess={this.updateRegistrationBirthDate}
                  />
                </Form.Group>
              </Col>

              {/* Member ID */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Member ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ID"
                    defaultValue={entry.memberId}
                    onBlur={this.updateRegistrationMemberId}
                  />
                </Form.Group>
              </Col>

              {/* Country */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <ValidatedInput
                    initialValue={entry.country}
                    placeholder="Country"
                    validate={s => (s === "" ? null : "success")}
                    onSuccess={this.updateRegistrationCountry}
                  />
                </Form.Group>
              </Col>

              {/* State */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <ValidatedInput
                    initialValue={entry.state}
                    placeholder="State"
                    validate={s => (s === "" ? null : "success")}
                    onSuccess={this.updateRegistrationState}
                  />
                </Form.Group>
              </Col>

              {/* Lot Number */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>Lot #</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    defaultValue={entry.lot === 0 ? "" : entry.lot.toString()}
                    onBlur={(event: { currentTarget: { value: string } }) =>
                      this.updateRegistrationLot(event.currentTarget.value)
                    }
                    onChange={(event: React.FormEvent<FormControlTypeHack> & { currentTarget: { value: string } }) =>
                      this.updateRegistrationLot(event.currentTarget.value)
                    }
                  />
                </Form.Group>
              </Col>

              {/* Notes */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Team</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    defaultValue={entry.team}
                    onBlur={this.updateRegistrationTeam}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Container style={gridStyle}>
            <Row>
              {/* Notes */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Instagram</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder=""
                      defaultValue={entry.instagram}
                      onBlur={this.updateRegistrationInstagram}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Notes */}
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Notes (for your personal use)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    defaultValue={entry.notes}
                    onBlur={this.updateRegistrationNotes}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  return {
    meet: state.meet,
    entry: entry
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    deleteRegistration: (entryId: number) => dispatch(deleteRegistration(entryId)),
    updateRegistration: (entryId: number, obj: Partial<Entry>) => dispatch(updateRegistration(entryId, obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
