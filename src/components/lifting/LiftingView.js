// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// The parent component of the Lifting page, contained by the LiftingContainer.
//
// The LiftingTable, LiftingFooter, etc. all share calculated state.
// This class performs the state calculations and communicates that to its
// sub-components via props.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TopBar from "./TopBar";
import LeftPanel from "./LeftPanel";
import LiftingTable from "./LiftingTable";
import LiftingFooter from "./LiftingFooter";

import styles from "./LiftingView.module.scss";

import { getLiftingOrder } from "../../logic/liftingOrder";

class LiftingView extends React.Component {
  render() {
    const now = getLiftingOrder(this.props.entriesInFlight, this.props.lifting);

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
              nextEntryId={now.nextEntryId}
              nextAttemptOneIndexed={now.nextAttemptOneIndexed}
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
