// vim: set ts=2 sts=2 sw=2 et:
//
// The header of the Lifting page, contained by the LiftingView.
// This is the parent element of information for the audience and the loaders.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { liftToAttemptFieldName } from "../../reducers/registrationReducer";

import styles from "./LiftingHeader.module.scss";

class LiftingHeader extends React.Component {
  render() {
    const lifterUp = this.props.currentEntryId !== null;

    let entry = null;
    if (lifterUp) {
      const idx = this.props.registration.lookup[this.props.currentEntryId];
      entry = this.props.registration.entries[idx];
    }

    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    const fieldKg = liftToAttemptFieldName(lift);

    const lifterName = lifterUp ? entry.name : "";
    const weightKg = lifterUp ? entry[fieldKg][attempt - 1] : 0;
    const weightLbs = weightKg * 2.20462262;

    return (
      <div className={styles.container}>
        <div className={styles.lifterBar}>
          <div className={styles.lifterName}>{lifterName}</div>
          <div className={styles.rightInfo}>
            <div>WEIGHT CLASS</div>
            <div>DIVISIONS</div>
          </div>
        </div>

        <div className={styles.loadingBar}>
          <div className={styles.attemptText}>
            {lift}
            {attempt}: {weightKg.toFixed(1)}kg / {weightLbs.toFixed(1)}lb
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

LiftingHeader.propTypes = {
  // Props calculated by the LiftingView.
  attemptOneIndexed: PropTypes.number.isRequired,
  orderedEntries: PropTypes.array.isRequired,
  currentEntryId: PropTypes.number, // Can be null.

  // Props passed from Redux state.
  registration: PropTypes.shape({
    entries: PropTypes.array.isRequired,
    lookup: PropTypes.array.isRequired
  }).isRequired,
  lifting: PropTypes.shape({
    lift: PropTypes.string.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingHeader);
