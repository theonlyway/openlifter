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
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import Select from "react-select";

import ValidatedTextInput from "../ValidatedTextInput";

import { validateIso8601Date } from "../../validation/iso8601Date";

import { deleteRegistration, updateRegistration } from "../../actions/registrationActions";

const eventOptions = [
  { value: "S", label: "S" },
  { value: "B", label: "B" },
  { value: "D", label: "D" },
  { value: "BD", label: "BD" },
  { value: "SBD", label: "SBD" },
  { value: "SB", label: "SB" },
  { value: "SD", label: "SD" }
];

class LifterRow extends React.Component {
  constructor(props) {
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
    this.updateRegistrationNotes = this.updateRegistrationNotes.bind(this);
  }

  deleteRegistrationClick(event) {
    this.props.deleteRegistration(this.props.id);
  }

  updateRegistrationDay(event) {
    const day = Number(event.target.value);
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

  updateRegistrationPlatform(event) {
    const platform = Number(event.target.value);
    if (this.props.entry.platform !== platform) {
      this.props.updateRegistration(this.props.id, { platform: platform });
    }
  }

  updateRegistrationFlight(event) {
    const flight = event.target.value;
    if (this.props.entry.flight !== flight) {
      this.props.updateRegistration(this.props.id, { flight: flight });
    }
  }

  updateRegistrationName(event) {
    const name = event.target.value;
    if (this.props.entry.name !== name) {
      this.props.updateRegistration(this.props.id, { name: name });
    }
  }

  updateRegistrationSex(event) {
    const sex = event.target.value;
    if (this.props.entry.sex !== sex) {
      this.props.updateRegistration(this.props.id, { sex: sex });
    }
  }

  updateRegistrationLot = event => {
    const lot = event.target.value;
    const asNumber = Number(lot);
    if (asNumber >= 0 && asNumber !== this.props.entry.lot) {
      this.props.updateRegistration(this.props.id, { lot: asNumber });
    }
  };

  updateRegistrationMemberId = event => {
    const memberId = event.target.value;
    if (this.props.entry.memberId !== memberId) {
      this.props.updateRegistration(this.props.id, { memberId: memberId });
    }
  };

  updateRegistrationBirthDate = birthDate => {
    if (this.props.entry.birthDate !== birthDate) {
      this.props.updateRegistration(this.props.id, { birthDate: birthDate });
    }
  };

  updateRegistrationCountry = country => {
    if (this.props.entry.country !== country) {
      this.props.updateRegistration(this.props.id, { country: country });
    }
  };

  updateRegistrationState = state => {
    if (this.props.entry.state !== state) {
      this.props.updateRegistration(this.props.id, { state: state });
    }
  };

  updateRegistrationDivisions(value, actionMeta) {
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

  updateRegistrationEvents(value, actionMeta) {
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

  updateRegistrationEquipment(event) {
    const equipment = event.target.value;
    if (this.props.entry.equipment !== equipment) {
      this.props.updateRegistration(this.props.id, { equipment: equipment });
    }
  }

  updateRegistrationTeam = event => {
    this.props.updateRegistration(this.props.id, { team: event.target.value });
  };

  updateRegistrationNotes = event => {
    this.props.updateRegistration(this.props.id, { notes: event.target.value });
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
          <FormControl type="text" placeholder="Name" defaultValue={entry.name} onBlur={this.updateRegistrationName} />
          <Button onClick={this.deleteRegistrationClick} variant="danger" style={{ marginLeft: "15px" }}>
            Delete
          </Button>
        </Card.Header>
        <Card.Body>
          <Container style={gridStyle}>
            {/* Day */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>Day</Form.Label>
                <FormControl
                  defaultValue={this.state.selectedDay}
                  as="select"
                  onChange={this.updateRegistrationDay}
                  className="custom-select"
                >
                  {dayOptions}
                </FormControl>
              </FormGroup>
            </Col>

            {/* Platform */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>Platform</Form.Label>
                <FormControl
                  defaultValue={entry.platform}
                  as="select"
                  onChange={this.updateRegistrationPlatform}
                  className="custom-select"
                >
                  {platformOptions}
                </FormControl>
              </FormGroup>
            </Col>

            {/* Flight */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>Flight</Form.Label>
                <FormControl
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
                </FormControl>
              </FormGroup>
            </Col>

            {/* Sex */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>Sex</Form.Label>
                <FormControl
                  defaultValue={entry.sex}
                  as="select"
                  onChange={this.updateRegistrationSex}
                  className="custom-select"
                >
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="Mx">Mx</option>
                </FormControl>
              </FormGroup>
            </Col>

            {/* Equipment */}
            <Col md={2}>
              <FormGroup>
                <Form.Label>Equipment</Form.Label>
                <FormControl
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
                </FormControl>
              </FormGroup>
            </Col>

            {/* Divisions */}
            <Col md={4}>
              <FormGroup>
                <Form.Label>Divisions</Form.Label>
                <Select
                  menuPlacement="auto"
                  options={divisionOptions}
                  isClearable={false}
                  isMulti={true}
                  onChange={this.updateRegistrationDivisions}
                  defaultValue={selectedDivisions}
                />
              </FormGroup>
            </Col>

            {/* Events */}
            <Col md={2}>
              <FormGroup>
                <Form.Label>Events</Form.Label>
                <Select
                  menuPlacement="auto"
                  options={eventOptions}
                  isClearable={false}
                  isMulti={true}
                  onChange={this.updateRegistrationEvents}
                  defaultValue={selectedEvents}
                />
              </FormGroup>
            </Col>
          </Container>

          <Container style={gridStyle}>
            {/* Date of Birth */}
            <Col md={2}>
              <FormGroup>
                <Form.Label>Date of Birth</Form.Label>
                <ValidatedTextInput
                  initialValue={entry.birthDate}
                  placeholder="YYYY-MM-DD"
                  getValidationState={validateIso8601Date}
                  onSuccess={this.updateRegistrationBirthDate}
                />
              </FormGroup>
            </Col>

            {/* Member ID */}
            <Col md={2}>
              <FormGroup>
                <Form.Label>Member ID</Form.Label>
                <FormControl
                  type="text"
                  placeholder="ID"
                  defaultValue={entry.memberId}
                  onBlur={this.updateRegistrationMemberId}
                />
              </FormGroup>
            </Col>

            {/* Country */}
            <Col md={2}>
              <FormGroup>
                <Form.Label>Country</Form.Label>
                <ValidatedTextInput
                  initialValue={entry.country}
                  placeholder="Country"
                  getValidationState={s => (s === "" ? null : "success")}
                  onSuccess={this.updateRegistrationCountry}
                />
              </FormGroup>
            </Col>

            {/* State */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>State</Form.Label>
                <ValidatedTextInput
                  initialValue={entry.state}
                  placeholder="State"
                  getValidationState={s => (s === "" ? null : "success")}
                  onSuccess={this.updateRegistrationState}
                />
              </FormGroup>
            </Col>

            {/* Lot Number */}
            <Col md={1}>
              <FormGroup>
                <Form.Label>Lot #</Form.Label>
                <FormControl
                  type="number"
                  min="0"
                  defaultValue={entry.lot === 0 ? "" : entry.lot}
                  onBlur={this.updateRegistrationLot}
                  onChange={this.updateRegistrationLot}
                />
              </FormGroup>
            </Col>

            {/* Notes */}
            <Col md={4}>
              <FormGroup>
                <Form.Label>Team</Form.Label>
                <FormControl
                  type="text"
                  placeholder=""
                  defaultValue={entry.team}
                  onBlur={this.updateRegistrationTeam}
                />
              </FormGroup>
            </Col>
          </Container>

          <Container style={gridStyle}>
            {/* Notes */}
            <Col md={12}>
              <FormGroup>
                <Form.Label>Notes (for your personal use)</Form.Label>
                <FormControl
                  type="text"
                  placeholder=""
                  defaultValue={entry.notes}
                  onBlur={this.updateRegistrationNotes}
                />
              </FormGroup>
            </Col>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  return {
    meet: state.meet,
    entry: entry
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteRegistration: entryId => dispatch(deleteRegistration(entryId)),
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

LifterRow.propTypes = {
  meet: PropTypes.shape({
    platformsOnDays: PropTypes.array,
    lengthDays: PropTypes.number,
    divisions: PropTypes.array
  }),
  entry: PropTypes.object,
  id: PropTypes.number,
  deleteRegistration: PropTypes.func,
  updateRegistration: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
