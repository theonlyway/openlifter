// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Registration page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";
import { Button, FormControl } from "react-bootstrap";

import { deleteRegistration, updateRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor() {
    super();
    this.getReduxEntry = this.getReduxEntry.bind(this);
    this.deleteRegistrationClick = this.deleteRegistrationClick.bind(this);
    this.updateRegistrationDay = this.updateRegistrationDay.bind(this);
    this.updateRegistrationPlatform = this.updateRegistrationPlatform.bind(this);
    this.updateRegistrationFlight = this.updateRegistrationFlight.bind(this);
    this.updateRegistrationName = this.updateRegistrationName.bind(this);
    this.updateRegistrationSex = this.updateRegistrationSex.bind(this);
    this.updateRegistrationEquipment = this.updateRegistrationEquipment.bind(this);
  }

  // Uses the global ID to return the currently-set entry object.
  getReduxEntry() {
    const lookup = this.props.registration.lookup;
    return this.props.registration.entries[lookup[this.props.id]];
  }

  deleteRegistrationClick(event) {
    this.props.deleteRegistration(this.props.id);
  }

  updateRegistrationDay(event) {
    const day = Number(event.target.value);
    const entry = this.getReduxEntry();

    // Also check whether the platform is now impossible.
    let platform = entry.platform;
    if (platform > this.props.meet.platformsOnDays[day - 1]) {
      platform = 1; // This matches the default behavior of the select element.
    }

    if (entry.day !== day) {
      this.props.updateRegistration(this.props.id, { day: day, platform: platform });
    }
  }

  updateRegistrationPlatform(event) {
    const platform = Number(event.target.value);
    if (this.getReduxEntry().platform !== platform) {
      this.props.updateRegistration(this.props.id, { platform: platform });
    }
  }

  updateRegistrationFlight(event) {
    const flight = event.target.value;
    if (this.getReduxEntry().flight !== flight) {
      this.props.updateRegistration(this.props.id, { flight: flight });
    }
  }

  updateRegistrationName(event) {
    const name = event.target.value;
    if (this.getReduxEntry().name !== name) {
      this.props.updateRegistration(this.props.id, { name: name });
    }
  }

  updateRegistrationSex(event) {
    const sex = event.target.value;
    if (this.getReduxEntry().sex !== sex) {
      this.props.updateRegistration(this.props.id, { sex: sex });
    }
  }

  updateRegistrationEquipment(event) {
    const equipment = event.target.value;
    if (this.getReduxEntry().equipment !== equipment) {
      this.props.updateRegistration(this.props.id, { equipment: equipment });
    }
  }

  render() {
    const initial = this.getReduxEntry();

    let dayOptions = [];
    for (let i = 1; i <= this.props.meet.lengthDays; i++) {
      dayOptions.push(<option value={i}>{i}</option>);
    }

    let platformOptions = [];
    for (let i = 1; i <= this.props.meet.platformsOnDays[initial.day - 1]; i++) {
      platformOptions.push(<option value={i}>{i}</option>);
    }

    return (
      <tr>
        <td>
          <FormControl defaultValue={initial.day} componentClass="select" onChange={this.updateRegistrationDay}>
            {dayOptions}
          </FormControl>
        </td>

        <td>
          <FormControl
            defaultValue={initial.platform}
            componentClass="select"
            onChange={this.updateRegistrationPlatform}
          >
            {platformOptions}
          </FormControl>
        </td>

        <td>
          <FormControl defaultValue={initial.flight} componentClass="select" onChange={this.updateRegistrationFlight}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
          </FormControl>
        </td>

        <td>
          <FormControl
            type="text"
            placeholder="Name"
            defaultValue={initial.name}
            onBlur={this.updateRegistrationName}
          />
        </td>

        <td>
          <FormControl defaultValue={initial.sex} componentClass="select" onChange={this.updateRegistrationSex}>
            <option value="M">M</option>
            <option value="F">F</option>
          </FormControl>
        </td>

        <td>
          <FormControl
            defaultValue={initial.equipment}
            componentClass="select"
            onChange={this.updateRegistrationEquipment}
          >
            <option value="Sleeves">Sleeves</option>
            <option value="Wraps">Wraps</option>
            <option value="Single-ply">Single-ply</option>
            <option value="Multi-ply">Multi-ply</option>
          </FormControl>
        </td>

        <td>
          <Button onClick={this.deleteRegistrationClick} bsStyle="danger">
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    deleteRegistration: entryId => dispatch(deleteRegistration(entryId)),
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
