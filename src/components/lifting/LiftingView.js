// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Lifting page, contained by the LiftingContainer.
//
// The LiftingContent, LiftingFooter, etc. all share calculated state.
// This class performs the state calculations and communicates that to its
// sub-components via props.
//

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LiftingContent from "./LiftingContent";
import LiftingFooter from "./LiftingFooter";

import { liftToAttemptFieldName, liftToStatusFieldName, MAX_ATTEMPTS } from "../../reducers/registrationReducer";

class LiftingView extends React.Component {
  constructor(props) {
    super(props);
    this.getLiftingState = this.getLiftingState.bind(this);
  }

  // Helper function: for a given entry, see what attempt number would be next.
  //
  // Returns a number >1 if the entry is still lifting, representing the next attempt.
  // Returns zero if the entry does not have any pending attempts.
  getNextAttemptNumberForEntry(entry, fieldKg, fieldStatus) {
    const weightsKg = entry[fieldKg];
    const statuses = entry[fieldStatus];

    // Lifters only set the next attempt, so loop backwards,
    // looking for the first attempt that meets the criteria.
    for (var i = MAX_ATTEMPTS - 1; i >= 0; i--) {
      if (weightsKg[i] !== 0 && statuses[i] === 0) {
        return i + 1;
      }
    }
    return 0;
  }

  // Determine the current active attempt for the current lift.
  //
  // An attempt is active if either:
  // 1. It has been overridden by the Attempt selector.
  // 2. There exists an attempt of that number with no success/failure value,
  //    and there is no lower attempt number with that property.
  //
  // Returns a number in the (inclusive) range of [1, MAX_ATTEMPTS].
  // If there is not enough data to make a decision, returns 1.
  getActiveAttemptNumber() {
    const entriesInFlight = this.props.entries;
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);
    const fieldStatus = liftToStatusFieldName(lift);

    if (this.props.lifting.overrideAttempt !== null) {
      return Number(this.props.lifting.overrideAttempt);
    }

    let earliestAttemptOneIndexed = MAX_ATTEMPTS + 1;
    for (var i = 0; i < entriesInFlight.length; i++) {
      const entry = entriesInFlight[i];
      const next = this.getNextAttemptNumberForEntry(entry, fieldKg, fieldStatus);
      // Zero return value means "no pending attempts for this entry."
      if (next > 0 && next < earliestAttemptOneIndexed) {
        earliestAttemptOneIndexed = next;
      }
    }

    // In the case of no actual data, just default to first attempt.
    if (earliestAttemptOneIndexed === MAX_ATTEMPTS + 1) {
      return 1;
    }
    return earliestAttemptOneIndexed;
  }

  // Main application logic. Reduces the Redux store to a local lifting state.
  getLiftingState() {
    const entriesInFlight = this.props.entries;
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    const attemptOneIndexed = this.getActiveAttemptNumber();

    // TODO: Just using some temp code to make sure props are hooked up.
    const orderedEntries = entriesInFlight.sort((a, b) => a[fieldKg][0] - b[fieldKg][0]);

    return {
      orderedEntries: orderedEntries,
      attemptOneIndexed: attemptOneIndexed
    };
  }

  render() {
    const now = this.getLiftingState();
    return [
      <LiftingContent orderedEntries={now.orderedEntries} key={0} />,
      <LiftingFooter attemptOneIndexed={now.attemptOneIndexed} key={1} />
    ];
  }
}

const mapStateToProps = state => {
  const day = state.lifting.day;
  const platform = state.lifting.platform;
  const flight = state.lifting.flight;

  // Only receive entries that are in the currently-lifting group.
  const entries = state.registration.entries.filter(
    entry => entry.day === day && entry.platform === platform && entry.flight === flight
  );

  return {
    meet: state.meet,
    entries: entries,
    lifting: state.lifting
  };
};

LiftingView.propTypes = {
  meet: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired,
  lifting: PropTypes.shape({
    lift: PropTypes.string.isRequired,
    overrideAttempt: PropTypes.any.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingView);
