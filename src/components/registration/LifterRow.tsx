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
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import Select, { ActionMeta, ValueType } from "react-select";

import { getString, localizeEvent } from "../../logic/strings";
import { displayNumber, string2number } from "../../logic/units";
import LocalizedString from "../translations/LocalizedString";
import ValidatedInput from "../ValidatedInput";

import { validateIso8601Date } from "../../validation/iso8601Date";
import { validatePositiveInteger } from "../../validation/positiveInteger";

import { deleteRegistration, updateRegistration } from "../../actions/registrationActions";
import { FormControlTypeHack, checkExhausted, assertString, assertFlight, assertSex } from "../../types/utils";
import { Entry, Equipment, Language, Validation } from "../../types/dataTypes";
import { Dispatch } from "redux";
import { GlobalState, MeetState } from "../../types/stateTypes";

type OptionType = {
  label: string;
  value: string;
};

interface OwnProps {
  id: number;
}

interface StateProps {
  meet: MeetState;
  entry: Entry;
  language: Language;
}

interface DispatchProps {
  deleteRegistration: (entryId: number) => void;
  updateRegistration: (entryId: number, obj: Partial<Entry>) => void;
}

interface InternalState {
  selectedDay: number;
}

type Props = OwnProps & StateProps & DispatchProps;

class LifterRow extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    // Store the Day in state to update the Platform options when the Day changes.
    // Store the Birth Date in state to re-render when a new date is selected
    this.state = {
      selectedDay: props.entry.day,
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
    this.updateRegistrationAge = this.updateRegistrationAge.bind(this);
    this.updateRegistrationCountry = this.updateRegistrationCountry.bind(this);
    this.updateRegistrationState = this.updateRegistrationState.bind(this);
    this.updateRegistrationDivisions = this.updateRegistrationDivisions.bind(this);
    this.updateRegistrationEvents = this.updateRegistrationEvents.bind(this);
    this.updateRegistrationEquipment = this.updateRegistrationEquipment.bind(this);
    this.updateRegistrationGuest = this.updateRegistrationGuest.bind(this);
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

  updateRegistrationName(event: React.FocusEvent<FormControlTypeHack>) {
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

  updateRegistrationLot(event: React.FormEvent<FormControlTypeHack> & { currentTarget: { value: string } }) {
    const asNumber = string2number(event.currentTarget.value);
    if (asNumber >= 0 && asNumber !== this.props.entry.lot) {
      this.props.updateRegistration(this.props.id, { lot: asNumber });
    }
  }

  updateRegistrationMemberId = (event: React.FormEvent<FormControlTypeHack>) => {
    const memberId = event.currentTarget.value;
    if (this.props.entry.memberId !== memberId && typeof memberId === "string") {
      this.props.updateRegistration(this.props.id, { memberId: memberId });
    }
  };

  updateRegistrationBirthDate = (birthDate: string) => {
    if (this.props.entry.birthDate !== birthDate) {
      this.props.updateRegistration(this.props.id, { birthDate: birthDate });
    }
  };

  updateRegistrationAge = (age: string) => {
    const num = string2number(age);
    if (this.props.entry.age !== num) {
      this.props.updateRegistration(this.props.id, { age: num });
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

  updateRegistrationDivisions(value: ValueType<OptionType> | null, actionMeta: ActionMeta) {
    if (value instanceof Array) {
      // Since updates are synchronous, we can just compare lengths.
      if (value.length !== this.props.entry.divisions.length) {
        const divisions = [];
        for (let i = 0; i < value.length; i++) {
          divisions.push(value[i].value);
        }
        this.props.updateRegistration(this.props.id, { divisions: divisions });
      }
    } else if (value === null) {
      // Null happens when the list has been cleared fully.
      if (this.props.entry.divisions.length > 0) {
        this.props.updateRegistration(this.props.id, { divisions: [] });
      }
    }
  }

  updateRegistrationEvents(value: ValueType<OptionType> | null, actionMeta: ActionMeta) {
    if (value instanceof Array) {
      // Since updates are synchronous, we can just compare lengths.
      if (value.length !== this.props.entry.events.length) {
        const events = [];
        for (let i = 0; i < value.length; i++) {
          events.push(value[i].value);
        }
        this.props.updateRegistration(this.props.id, { events: events });
      }
    } else if (value === null) {
      // Null happens when the list has been cleared fully.
      if (this.props.entry.events.length > 0) {
        this.props.updateRegistration(this.props.id, { events: [] });
      }
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
        case "Unlimited":
          this.props.updateRegistration(this.props.id, { equipment: equipment });
          break;
        default:
          checkExhausted(equipment);
          break;
      }
    }
  }

  updateRegistrationGuest = (event: React.FocusEvent<FormControlTypeHack>) => {
    if (event.currentTarget.value === "true") {
      this.props.updateRegistration(this.props.id, { guest: true });
    } else {
      this.props.updateRegistration(this.props.id, { guest: false });
    }
  };

  updateRegistrationTeam = (event: React.FocusEvent<FormControlTypeHack>) => {
    if (assertString(event.currentTarget.value)) {
      this.props.updateRegistration(this.props.id, { team: event.currentTarget.value });
    }
  };

  updateRegistrationInstagram = (event: React.FocusEvent<FormControlTypeHack>) => {
    if (assertString(event.currentTarget.value)) {
      this.props.updateRegistration(this.props.id, { instagram: event.currentTarget.value });
    }
  };

  updateRegistrationNotes = (event: React.FocusEvent<FormControlTypeHack>) => {
    if (assertString(event.currentTarget.value)) {
      this.props.updateRegistration(this.props.id, { notes: event.currentTarget.value });
    }
  };

  // FIXME: Could be shared with weighins logic.
  validateAge = (value?: string): Validation => {
    if (value === "") return null;

    const pos: Validation = validatePositiveInteger(value);
    if (pos === "success") {
      // Complain a little if the age is implausible.
      const n = Number(value);
      if (n <= 4 || n > 100) return "warning";
    }
    return pos;
  };

  render() {
    const entry = this.props.entry;
    const language = this.props.language;

    const dayOptions = [];
    for (let i = 1; i <= this.props.meet.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    const platformOptions = [];
    for (let i = 1; i <= this.props.meet.platformsOnDays[entry.day - 1]; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    const divisionOptions = [];
    for (let i = 0; i < this.props.meet.divisions.length; i++) {
      const division = this.props.meet.divisions[i];
      divisionOptions.push({ value: division, label: division });
    }

    const selectedDivisions = [];
    for (let i = 0; i < entry.divisions.length; i++) {
      const division = entry.divisions[i];
      selectedDivisions.push({ value: division, label: division });
    }

    const selectedEvents = [];
    for (let i = 0; i < entry.events.length; i++) {
      const event = entry.events[i];
      selectedEvents.push({ value: event, label: localizeEvent(event, language) });
    }

    const gridStyle = { padding: "0px", margin: "0px" };

    const stringCountry = getString("common.country", language);
    const stringState = getString("registration.state-province", language);
    const stringBirthDatePlaceholder = getString("registration.birthdate-placeholder", language);
    const stringMemberIdPlaceholder = getString("registration.member-id-placeholder", language);
    const stringSelectPlaceholder = getString("common.select-placeholder", language);

    const eventOptions = [
      { value: "S", label: getString("event.s", language) },
      { value: "B", label: getString("event.b", language) },
      { value: "D", label: getString("event.d", language) },
      { value: "BD", label: getString("event.bd", language) },
      { value: "SBD", label: getString("event.sbd", language) },
      { value: "SB", label: getString("event.sb", language) },
      { value: "SD", label: getString("event.sd", language) },
    ];

    return (
      <Card style={{ overflow: "visible", marginBottom: "17px" }}>
        <Card.Header style={{ display: "flex" }}>
          <Form.Control type="text" placeholder="" value={entry.name} onChange={this.updateRegistrationName} />
          <Button
            onClick={this.deleteRegistrationClick}
            variant="danger"
            style={{ marginLeft: "15px", minWidth: "100px" }}
          >
            <LocalizedString id="registration.button-delete" />
          </Button>
        </Card.Header>
        <Card.Body>
          <Container style={gridStyle}>
            <Row>
              {/* Day */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.day-label" defaultMessage="Day" />
                  </Form.Label>
                  <Form.Control
                    value={this.state.selectedDay.toString()}
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
                  <Form.Label>
                    <FormattedMessage id="registration.platform-label" defaultMessage="Platform" />
                  </Form.Label>
                  <Form.Control
                    value={entry.platform.toString()}
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
                  <Form.Label>
                    <FormattedMessage id="registration.flight-label" defaultMessage="Flight" />
                  </Form.Label>
                  <Form.Control
                    value={entry.flight}
                    as="select"
                    onChange={this.updateRegistrationFlight}
                    className="custom-select"
                  >
                    <option value="A">{getString("flight.a", language)}</option>
                    <option value="B">{getString("flight.b", language)}</option>
                    <option value="C">{getString("flight.c", language)}</option>
                    <option value="D">{getString("flight.d", language)}</option>
                    <option value="E">{getString("flight.e", language)}</option>
                    <option value="F">{getString("flight.f", language)}</option>
                    <option value="G">{getString("flight.g", language)}</option>
                    <option value="H">{getString("flight.h", language)}</option>
                    <option value="I">{getString("flight.i", language)}</option>
                    <option value="J">{getString("flight.j", language)}</option>
                    <option value="K">{getString("flight.k", language)}</option>
                    <option value="L">{getString("flight.l", language)}</option>
                    <option value="M">{getString("flight.m", language)}</option>
                    <option value="N">{getString("flight.n", language)}</option>
                    <option value="O">{getString("flight.o", language)}</option>
                    <option value="P">{getString("flight.p", language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Sex */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.sex-label" defaultMessage="Sex" />
                  </Form.Label>
                  <Form.Control
                    value={entry.sex}
                    as="select"
                    onChange={this.updateRegistrationSex}
                    className="custom-select"
                  >
                    <option value="M">{getString("sex.m", language)}</option>
                    <option value="F">{getString("sex.f", language)}</option>
                    <option value="Mx">{getString("sex.mx", language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Equipment */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.equipment-label" defaultMessage="Equipment" />
                  </Form.Label>
                  <Form.Control
                    value={entry.equipment}
                    as="select"
                    onChange={this.updateRegistrationEquipment}
                    className="custom-select"
                  >
                    <option value="Bare">{getString("equipment.bare", language)}</option>
                    <option value="Sleeves">{getString("equipment.sleeves", language)}</option>
                    <option value="Wraps">{getString("equipment.wraps", language)}</option>
                    <option value="Single-ply">{getString("equipment.single-ply", language)}</option>
                    <option value="Multi-ply">{getString("equipment.multi-ply", language)}</option>
                    <option value="Unlimited">{getString("equipment.unlimited", language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Divisions */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.divisions-label" defaultMessage="Divisions" />
                  </Form.Label>
                  <Select
                    menuPlacement="auto"
                    placeholder={stringSelectPlaceholder}
                    options={divisionOptions}
                    isClearable={false}
                    isMulti={true}
                    onChange={this.updateRegistrationDivisions}
                    value={selectedDivisions}
                  />
                </Form.Group>
              </Col>

              {/* Events */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.events-label" defaultMessage="Events" />
                  </Form.Label>
                  <Select
                    menuPlacement="auto"
                    placeholder={stringSelectPlaceholder}
                    options={eventOptions}
                    isClearable={false}
                    isMulti={true}
                    onChange={this.updateRegistrationEvents}
                    value={selectedEvents}
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
                  <Form.Label>
                    <FormattedMessage id="registration.birthdate-label" defaultMessage="Date of Birth" />
                  </Form.Label>
                  <ValidatedInput
                    initialValue={entry.birthDate}
                    placeholder={stringBirthDatePlaceholder}
                    validate={validateIso8601Date}
                    onSuccess={this.updateRegistrationBirthDate}
                  />
                </Form.Group>
              </Col>

              {/* Age */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>{getString("common.age", language)}</Form.Label>
                  <ValidatedInput
                    initialValue={entry.age === 0 ? "" : displayNumber(entry.age, language)}
                    placeholder={getString("common.age", language)}
                    validate={this.validateAge}
                    onSuccess={this.updateRegistrationAge}
                  />
                </Form.Group>
              </Col>

              {/* Member ID */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.member-id-label" defaultMessage="Member ID" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={stringMemberIdPlaceholder}
                    value={entry.memberId}
                    onChange={this.updateRegistrationMemberId}
                  />
                </Form.Group>
              </Col>

              {/* Country */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>{stringCountry}</Form.Label>
                  <ValidatedInput
                    initialValue={entry.country}
                    placeholder={stringCountry}
                    validate={(s) => (s === "" ? null : "success")}
                    onSuccess={this.updateRegistrationCountry}
                  />
                </Form.Group>
              </Col>

              {/* State */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>{stringState}</Form.Label>
                  <ValidatedInput
                    initialValue={entry.state}
                    placeholder={stringState}
                    validate={(s) => (s === "" ? null : "success")}
                    onSuccess={this.updateRegistrationState}
                  />
                </Form.Group>
              </Col>

              {/* Lot Number */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.lot-label" defaultMessage="Lot #" />
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={entry.lot === 0 ? "" : entry.lot.toString()}
                    onChange={this.updateRegistrationLot}
                  />
                </Form.Group>
              </Col>

              {/* Guest */}
              <Col md={1}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.guest-label" defaultMessage="Guest" />
                  </Form.Label>
                  <Form.Control
                    value={entry.guest ? entry.guest.toString() : "false"}
                    as="select"
                    onChange={this.updateRegistrationGuest}
                    className="custom-select"
                  >
                    <option value="false">{getString("common.response-no", language)}</option>
                    <option value="true">{getString("common.response-yes", language)}</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Team */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.team-label" defaultMessage="Team" />
                  </Form.Label>
                  <Form.Control type="text" placeholder="" value={entry.team} onChange={this.updateRegistrationTeam} />
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Container style={gridStyle}>
            <Row>
              {/* Notes */}
              <Col md={2}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.instagram-label" defaultMessage="Instagram" />
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={entry.instagram}
                      onChange={this.updateRegistrationInstagram}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Notes */}
              <Col md={10}>
                <Form.Group>
                  <Form.Label>
                    <FormattedMessage id="registration.notes-label" defaultMessage="Notes (for your personal use)" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={entry.notes}
                    onChange={this.updateRegistrationNotes}
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

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  return {
    meet: state.meet,
    entry: entry,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    deleteRegistration: (entryId: number) => dispatch(deleteRegistration(entryId)),
    updateRegistration: (entryId: number, obj: Partial<Entry>) => dispatch(updateRegistration(entryId, obj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LifterRow);
