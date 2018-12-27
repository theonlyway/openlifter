// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Weigh-inss page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor(props) {
    super(props);
    this.getReduxEntry = this.getReduxEntry.bind(this);
  }

  // Uses the global ID to return the currently-set entry object.
  getReduxEntry() {
    const lookup = this.props.registration.lookup;
    return this.props.registration.entries[lookup[this.props.id]];
  }

  render() {
    const lifter = this.getReduxEntry();

    let selectedDivisions = [];
    for (let i = 0; i < lifter.divisions.length; i++) {
      const division = lifter.divisions[i];
      selectedDivisions.push({ value: division, label: division });
    }

    let selectedEvents = [];
    for (let i = 0; i < lifter.events.length; i++) {
      const events = lifter.events[i];
      selectedEvents.push({ value: events, label: events });
    }

    return (
      <tr>
        <td>{lifter.day}</td>
        <td>{lifter.platform}</td>
        <td>{lifter.flight}</td>
        <td>{lifter.name}</td>
        <td>{lifter.sex}</td>
        <td>{lifter.equipment}</td>
        <td>{selectedDivisions.map(division => division.label).join(",")}</td>
        <td>{selectedEvents.map(event => event.label).join(",")}</td>
      </tr>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

LifterRow.propTypes = {
  registration: PropTypes.shape({
    lookup: PropTypes.object,
    entries: PropTypes.array
  }),
  id: PropTypes.number,
  meet: PropTypes.shape({
    platformsOnDays: PropTypes.array,
    lengthDays: PropTypes.number,
    divisions: PropTypes.array
  }),
  updateRegistration: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
