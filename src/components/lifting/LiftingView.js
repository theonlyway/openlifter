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
    const entriesInFlight = this.props.entriesInFlight;
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

  // Returns the entries in lifting order for the current attempt.
  //
  // This function is recursive: attempts past the first are partially defined
  // by the ordering used in previous attempts, for federations not using lot numbers.
  orderEntriesForAttempt(attemptOneIndexed) {
    const entriesInFlight = this.props.entriesInFlight;
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    return entriesInFlight.sort((a, b) => {
      const aKg = a[fieldKg][attemptOneIndexed - 1];
      const bKg = b[fieldKg][attemptOneIndexed - 1];

      // If both are zero, compare lexicographically by Name.
      if (aKg === 0 && bKg === 0) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }

      // If only one is zero, sort it at the end.
      if (aKg === 0 && bKg !== 0) return 1;
      if (aKg !== 0 && bKg === 0) return -1;

      // If the weight is equal, apply tie-breaking logic.
      if (aKg === bKg) {
        // If the federation uses lot numbers, break ties using lot.
        if (a.lot !== 0 && b.lot !== 0) {
          return a.lot - b.lot;
        }

        // If this is not the first attempt, preserve the same relative order
        // that occurred in the previous attempt.
        if (attemptOneIndexed >= 2) {
          const prevOrder = this.orderEntriesForAttempt(attemptOneIndexed - 1);
          return prevOrder.indexOf(a) - prevOrder.indexOf(b);
        }

        // If this is the first attempt and their bodyweights are unequal,
        // have the lighter lifter go first.
        if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

        // If this is the first attempt, two lifters have the same attempt,
        // and they also have the same bodyweight, sort by Name.
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }

      // Sort by WeightKg, ascending.
      return aKg - bKg;
    });
  }

  // Returns either the current entry ID or null if no active entry.
  //
  // In the ordered entries, the earliest lifter that hasn't gone yet is going.
  // This can be manually overridden by UI controls.
  getCurrentEntryId(orderedEntries, attemptOneIndexed) {
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);
    const fieldStatus = liftToStatusFieldName(lift);

    if (this.props.lifting.overrideEntryId !== null) {
      return Number(this.props.lifting.overrideEntryId);
    }

    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      const idx = attemptOneIndexed - 1;
      if (entry[fieldKg][idx] !== 0 && entry[fieldStatus][idx] === 0) {
        return entry.id;
      }
    }
    return null;
  }

  // Main application logic. Reduces the Redux store to a local lifting state.
  getLiftingState() {
    const attemptOneIndexed = this.getActiveAttemptNumber();
    const orderedEntries = this.orderEntriesForAttempt(attemptOneIndexed);
    const currentEntryId = this.getCurrentEntryId(orderedEntries, attemptOneIndexed);

    return {
      orderedEntries: orderedEntries,
      currentEntryId: currentEntryId,
      attemptOneIndexed: attemptOneIndexed
    };
  }

  render() {
    const now = this.getLiftingState();

    return [
      <LiftingContent orderedEntries={now.orderedEntries} currentEntryId={now.currentEntryId} key={0} />,
      <LiftingFooter
        attemptOneIndexed={now.attemptOneIndexed}
        orderedEntries={now.orderedEntries}
        currentEntryId={now.currentEntryId}
        key={1}
      />
    ];
  }
}

const mapStateToProps = state => {
  const day = state.lifting.day;
  const platform = state.lifting.platform;
  const flight = state.lifting.flight;

  // Only receive entries that are in the currently-lifting group.
  const entriesInFlight = state.registration.entries.filter(
    entry => entry.day === day && entry.platform === platform && entry.flight === flight
  );

  return {
    meet: state.meet,
    entriesInFlight: entriesInFlight,
    lifting: state.lifting
  };
};

LiftingView.propTypes = {
  meet: PropTypes.object.isRequired,
  entriesInFlight: PropTypes.array.isRequired,
  lifting: PropTypes.shape({
    lift: PropTypes.string.isRequired,
    overrideAttempt: PropTypes.number,
    overrideEntryId: PropTypes.number
  }).isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingView);
