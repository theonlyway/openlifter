// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Registration page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";
import { Button, Col, FormControl, Row } from "react-bootstrap";

import { deleteRegistration, updateRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor() {
    super();
    this.getReduxEntry = this.getReduxEntry.bind(this);
    this.deleteRegistrationClick = this.deleteRegistrationClick.bind(this);
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

    return (
      <Row>
        <Col md={2}>
          <FormControl
            type="text"
            placeholder="Name"
            defaultValue={initial.name}
            onBlur={this.updateRegistrationName}
          />
        </Col>

        <Col md={1}>{this.props.id}</Col>

        <Col md={1}>
          <FormControl defaultValue={initial.sex} componentClass="select" onChange={this.updateRegistrationSex}>
            <option value="M">M</option>
            <option value="F">F</option>
          </FormControl>
        </Col>

        <Col md={2}>
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
        </Col>

        <Col md={1}>
          <Button onClick={this.deleteRegistrationClick} bsStyle="danger">
            Delete
          </Button>
        </Col>
      </Row>
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
