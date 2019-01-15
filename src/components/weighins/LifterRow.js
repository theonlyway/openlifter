// vim: set ts=2 sts=2 sw=2 et:
//
// Defines a row in the LifterTable on the Weigh-inss page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormControl } from "react-bootstrap";

import WeightInput from "./WeightInput";
import AgeInput from "./AgeInput";

import { updateRegistration } from "../../actions/registrationActions";

class LifterRow extends React.Component {
  constructor(props) {
    super(props);
    this.updateRegistrationSquatRackInfo = this.updateRegistrationSquatRackInfo.bind(this);
    this.updateRegistrationBenchRackInfo = this.updateRegistrationBenchRackInfo.bind(this);

    this.renderSquatRackInfo = this.renderSquatRackInfo.bind(this);
    this.renderBenchRackInfo = this.renderBenchRackInfo.bind(this);
  }

  updateRegistrationSquatRackInfo(event) {
    const info = event.target.value;
    if (this.props.entry.squatRackInfo !== info) {
      this.props.updateRegistration(this.props.id, { squatRackInfo: info });
    }
  }

  updateRegistrationBenchRackInfo(event) {
    const info = event.target.value;
    if (this.props.entry.benchRackInfo !== info) {
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

  render() {
    const entry = this.props.entry;

    // Check whether the event(s) include a given lift.
    let hasSquat = false;
    let hasBench = false;
    let hasDeadlift = false;
    for (let i = 0; i < entry.events.length; i++) {
      const event = entry.events[i];
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

    // Check whether the first attempt already occurred.
    const disableSquatWeight = !hasSquat || entry.squatStatus[0] !== 0;
    const disableBenchWeight = !hasBench || entry.benchStatus[0] !== 0;
    const disableDeadliftWeight = !hasDeadlift || entry.deadliftStatus[0] !== 0;

    return (
      <tr>
        <td>{entry.platform}</td>
        <td>{entry.flight}</td>
        <td>{entry.name}</td>

        <td>
          <AgeInput id={this.props.id} age={entry.age} field="age" />
        </td>

        <td>
          <WeightInput id={this.props.id} field="bodyweightKg" disabled={false} />
        </td>

        <td>{this.renderSquatRackInfo(entry, hasSquat)}</td>

        <td>
          <WeightInput id={this.props.id} lift="S" attemptOneIndexed={1} disabled={disableSquatWeight} />
        </td>

        <td>{this.renderBenchRackInfo(entry, hasBench)}</td>

        <td>
          <WeightInput id={this.props.id} lift="B" attemptOneIndexed={1} disabled={disableBenchWeight} />
        </td>

        <td>
          <WeightInput id={this.props.id} lift="D" attemptOneIndexed={1} disabled={disableDeadliftWeight} />
        </td>
      </tr>
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
  updateRegistration: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifterRow);
