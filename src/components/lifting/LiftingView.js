// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Lifting page, contained by the LiftingContainer.
//
// The LiftingTable, LiftingFooter, etc. all share calculated state.
// This class performs the state calculations and communicates that to its
// sub-components via props.
//

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TopBar from "./TopBar";
import LeftPanel from "./LeftPanel";
import LiftingTable from "./LiftingTable";
import LiftingFooter from "./LiftingFooter";

import styles from "./LiftingView.module.scss";

import {
  liftToAttemptFieldName,
  liftToStatusFieldName,
  MAX_ATTEMPTS,
  orderEntriesByAttempt
} from "../../reducers/registrationReducer";

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

    // Allow manual override.
    if (this.props.lifting.overrideAttempt !== null) {
      return Number(this.props.lifting.overrideAttempt);
    }

    // Iterate in reverse, looking for the earliest attempt that hasn't been lifted.
    let earliestAttemptOneIndexed = MAX_ATTEMPTS + 1;
    for (var i = 0; i < entriesInFlight.length; i++) {
      const entry = entriesInFlight[i];
      const next = this.getNextAttemptNumberForEntry(entry, fieldKg, fieldStatus);
      // Zero return value means "no pending attempts for this entry."
      if (next > 0 && next < earliestAttemptOneIndexed) {
        earliestAttemptOneIndexed = next;
      }
    }

    // In the case of no pending lifts, just default to first attempt.
    if (earliestAttemptOneIndexed === MAX_ATTEMPTS + 1) {
      return 1;
    }
    return earliestAttemptOneIndexed;
  }

  // Returns a copy of the entries in lifting order for the current attempt.
  orderEntriesForAttempt(attemptOneIndexed) {
    const entriesInFlight = this.props.entriesInFlight;
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    const attemptZeroIndexed = attemptOneIndexed - 1;
    const existsNextAttempt = attemptOneIndexed + 1 <= MAX_ATTEMPTS;
    const existsPrevAttempt = attemptOneIndexed > 1;

    // Divide the entries into four disjoint groups:
    let byNextAttempt = []; // Entries that should be sorted by their next attempt.
    let byThisAttempt = []; // Entries that should be sorted by this attempt.
    let byPrevAttempt = []; // Entries that should be sorted by previous attempt.
    let notLifting = []; // Entries that don't have either this or next attempts in.

    for (let i = 0; i < entriesInFlight.length; i++) {
      const entry = entriesInFlight[i];

      if (existsNextAttempt && entry[fieldKg][attemptZeroIndexed + 1] !== 0) {
        byNextAttempt.push(entry);
      } else if (entry[fieldKg][attemptZeroIndexed] !== 0) {
        byThisAttempt.push(entry);
      } else if (existsPrevAttempt && entry[fieldKg][attemptZeroIndexed - 1] !== 0) {
        byPrevAttempt.push(entry);
      } else {
        notLifting.push(entry);
      }
    }

    // Perform sorting on the relative groups.
    if (existsNextAttempt) {
      orderEntriesByAttempt(byNextAttempt, fieldKg, attemptOneIndexed + 1);
    }
    orderEntriesByAttempt(byThisAttempt, fieldKg, attemptOneIndexed);
    if (existsPrevAttempt) {
      orderEntriesByAttempt(byPrevAttempt, fieldKg, attemptOneIndexed - 1);
    }
    orderEntriesByAttempt(notLifting, fieldKg, attemptOneIndexed);

    // Arrange these three groups consecutively.
    return Array.prototype.concat(byNextAttempt, byThisAttempt, byPrevAttempt, notLifting);
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

    return (
      <div id="liftingView" className={styles.liftingView}>
        <TopBar
          attemptOneIndexed={now.attemptOneIndexed}
          orderedEntries={now.orderedEntries}
          currentEntryId={now.currentEntryId}
        />

        <div className={styles.middleParentContainer}>
          <div className={styles.leftPanelContainer}>
            <LeftPanel
              attemptOneIndexed={now.attemptOneIndexed}
              orderedEntries={now.orderedEntries}
              currentEntryId={now.currentEntryId}
            />
          </div>

          <div className={styles.rightPanelContainer}>
            <LiftingTable
              attemptOneIndexed={now.attemptOneIndexed}
              orderedEntries={now.orderedEntries}
              currentEntryId={now.currentEntryId}
            />
          </div>
        </div>

        <LiftingFooter
          attemptOneIndexed={now.attemptOneIndexed}
          orderedEntries={now.orderedEntries}
          currentEntryId={now.currentEntryId}
        />
      </div>
    );
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
