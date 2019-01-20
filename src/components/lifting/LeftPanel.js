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
  getBarLoadProps(entryId, attemptOneIndexed) {
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    // Defaults, in case of no lifter.
    if (entryId === null || entryId === undefined) {
      return {
        weightKg: 0,
        weightLbs: 0,
        rackInfo: ""
      };
    }

    const idx = this.props.registration.lookup[entryId];
    const entry = this.props.registration.entries[idx];

    const weightKg = entry[fieldKg][attemptOneIndexed - 1];
    const weightLbs = weightKg * 2.20462262;

    let rackInfo = "";
    if (lift === "S") rackInfo = entry.squatRackInfo;
    if (lift === "B") rackInfo = entry.benchRackInfo;

    return {
      weightKg: weightKg,
      weightLbs: weightLbs,
      rackInfo: rackInfo
    };
  }

  render() {
    const current = this.getBarLoadProps(this.props.currentEntryId, this.props.attemptOneIndexed);
    const next = this.getBarLoadProps(this.props.nextEntryId, this.props.nextAttemptOneIndexed);

    // Show one decimal point, and omit it if possible.
    const weightKgText = current.weightKg.toFixed(1).replace(".0", "");
    const weightLbsText = current.weightLbs.toFixed(1).replace(".0", "");

    return (
      <div className={styles.container}>
        <div className={styles.activeCard}>
          <div className={styles.loadingBar}>
            <div className={styles.attemptText}>
              {this.props.lifting.lift}
              {this.props.attemptOneIndexed}: {weightKgText}kg / {weightLbsText}lb
            </div>
            <div className={styles.barArea}>
              <BarLoad weightKg={current.weightKg} rackInfo={current.rackInfo} />
            </div>
          </div>
        </div>

        <div className={styles.loadingBar}>
          <div className={styles.nextText}>NEXT UP</div>
          <div className={styles.barArea}>
            <BarLoad weightKg={next.weightKg} rackInfo={next.rackInfo} />
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
  nextEntryId: PropTypes.number,
  nextAttemptOneIndexed: PropTypes.number, // Can be null.

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
