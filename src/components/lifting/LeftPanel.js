// vim: set ts=2 sts=2 sw=2 et:
//
// The left panel on the lifting page, showing information about the current lifter
// and helpful information for the loading crew.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { liftToAttemptFieldName } from "../../reducers/registrationReducer";

import BarLoad from "./BarLoad.js";

import styles from "./LeftPanel.module.scss";

class LeftPanel extends React.Component {
  render() {
    const lift = this.props.lifting.lift;
    const attempt = this.props.attemptOneIndexed;
    const fieldKg = liftToAttemptFieldName(lift);

    // Defaults, in case of no lifter.
    let weightKg = 0;
    let weightLbs = 0;
    let rackInfo = "";

    // In the case of a lifter, set fields.
    if (this.props.currentEntryId !== null) {
      const idx = this.props.registration.lookup[this.props.currentEntryId];
      const entry = this.props.registration.entries[idx];

      weightKg = entry[fieldKg][attempt - 1];
      weightLbs = weightKg * 2.20462262;

      if (lift === "S") rackInfo = entry.squatRackInfo;
      if (lift === "B") rackInfo = entry.benchRackInfo;
    }

    return (
      <div className={styles.container}>
        <div className={styles.loadingBar}>
          <div className={styles.attemptText}>
            {lift}
            {attempt}: {weightKg.toFixed(1)}kg / {weightLbs.toFixed(1)}lb
          </div>
          <div className={styles.rightInfo}>
            <BarLoad weightKg={weightKg} rackInfo={rackInfo} />
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

LeftPanel.propTypes = {
  // Props calculated by the LiftingView.
  attemptOneIndexed: PropTypes.number.isRequired,
  orderedEntries: PropTypes.array.isRequired,
  currentEntryId: PropTypes.number, // Can be null.

  // Props passed from Redux state.
  registration: PropTypes.shape({
    entries: PropTypes.array.isRequired,
    lookup: PropTypes.object.isRequired
  }).isRequired,
  lifting: PropTypes.shape({
    lift: PropTypes.string.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  null
)(LeftPanel);
