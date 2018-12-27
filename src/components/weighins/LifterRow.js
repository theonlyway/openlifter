// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Weigh-inss page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormControl } from "react-bootstrap";

import { updateRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor(props) {
    super(props);
    this.getReduxEntry = this.getReduxEntry.bind(this);
    this.updateRegistrationSquatRackInfo = this.updateRegistrationSquatRackInfo.bind(this);
    this.updateRegistrationBenchRackInfo = this.updateRegistrationBenchRackInfo.bind(this);

    this.renderSquatRackInfo = this.renderSquatRackInfo.bind(this);
    this.renderBenchRackInfo = this.renderBenchRackInfo.bind(this);
    this.renderDeadliftOpener = this.renderDeadliftOpener.bind(this);
  }

  // Uses the global ID to return the currently-set entry object.
  getReduxEntry() {
    const lookup = this.props.registration.lookup;
    return this.props.registration.entries[lookup[this.props.id]];
  }

  updateRegistrationSquatRackInfo(event) {
    const info = event.target.value;
    if (this.getReduxEntry().squatRackInfo !== info) {
      this.props.updateRegistration(this.props.id, { squatRackInfo: info });
    }
  }

  updateRegistrationBenchRackInfo(event) {
    const info = event.target.value;
    if (this.getReduxEntry().benchRackInfo !== info) {
      this.props.updateRegistration(this.props.id, { benchRackInfo: info });
    }
  }

  renderSquatRackInfo(lifter, hasSquat) {
    if (hasSquat) {
      return (
        <FormControl type="text" defaultValue={lifter.squatRackInfo} onBlur={this.updateRegistrationSquatRackInfo} />
      );
    } else {
      return <FormControl type="text" disabled />;
    }
  }

  renderBenchRackInfo(lifter, hasBench) {
    if (hasBench) {
      return (
        <FormControl type="text" defaultValue={lifter.benchRackInfo} onBlur={this.updateRegistrationBenchRackInfo} />
      );
    } else {
      return <FormControl type="text" disabled />;
    }
  }

  renderDeadliftOpener(lifter, hasDeadlift) {
    if (hasDeadlift) {
      return <span>Todo</span>;
    } else {
      return <FormControl type="text" disabled />;
    }
  }

  render() {
    const lifter = this.getReduxEntry();

    let hasSquat = false;
    let hasBench = false;
    let hasDeadlift = false;
    for (let i = 0; i < lifter.events.length; i++) {
      const event = lifter.events[i];
      if (event.includes("S")) {
        hasSquat = true;
      }
      if (event.includes("B")) {
        hasBench = true;
      }
      if (event.includes("D")) {
        hasDeadlift = true;
      }
    }

    return (
      <tr>
        <td>{lifter.platform}</td>
        <td>{lifter.flight}</td>
        <td>{lifter.name}</td>

        <td>BodyweightKg</td>

        <td>SquatFirstAttempt</td>

        <td>{this.renderSquatRackInfo(lifter, hasSquat)}</td>

        <td>BenchFirstAttempt</td>

        <td>{this.renderBenchRackInfo(lifter, hasBench)}</td>
        <td>{this.renderDeadliftOpener(lifter, hasDeadlift)}</td>
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
