// vim: set ts=2 sts=2 sw=2 et:
//
// The top bar of the Lifting page, containing huge text about the current lifter.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styles from "./TopBar.module.scss";

class LiftingHeader extends React.Component {
  render() {
    // Defaults, in case of no lifter.
    let lifterName = "Flight Complete";

    // In the case of a lifter, set fields.
    if (this.props.currentEntryId !== null) {
      const idx = this.props.registration.lookup[this.props.currentEntryId];
      const entry = this.props.registration.entries[idx];
      lifterName = entry.name;
    }

    return (
      <div className={styles.topBar}>
        <span className={styles.lifterName}>{lifterName}</span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    registration: state.registration
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
    lookup: PropTypes.object.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingHeader);
