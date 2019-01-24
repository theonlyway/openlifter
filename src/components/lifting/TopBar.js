// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// The top bar of the Lifting page, containing huge text about the current lifter.

import React from "react";
import { connect } from "react-redux";

import type { Entry, RegistrationState } from "../../reducers/registrationReducer";

import styles from "./TopBar.module.scss";

type Props = {
  // ownProps from the LiftingView.
  attemptOneIndexed: number,
  orderedEntries: Array<Entry>,
  currentEntryId: ?number,

  // Props from Redux state.
  registration: RegistrationState
};

class LiftingHeader extends React.Component<Props> {
  render() {
    // Defaults, in case of no lifter.
    let lifterName = "Flight Complete";
    let divisionsStr = null;

    // In the case of a lifter, set fields.
    if (this.props.currentEntryId) {
      const idx = this.props.registration.lookup[this.props.currentEntryId];
      const entry = this.props.registration.entries[idx];
      lifterName = entry.name;

      divisionsStr = " / " + entry.divisions.join(", ");
    }

    return (
      <div className={styles.topBar}>
        <span className={styles.lifterName}>{lifterName}</span>
        <span className={styles.divisions}>{divisionsStr}</span>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    registration: state.registration
  };
};

export default connect(
  mapStateToProps,
  null
)(LiftingHeader);
