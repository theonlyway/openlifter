// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

import TopBar from "./TopBar";
import LeftPanel from "./LeftPanel";
import LiftingTable from "./LiftingTable";
import LiftingFooter from "./LiftingFooter";

import styles from "./LiftingView.module.scss";

import { getLiftingOrder } from "../../logic/liftingOrder";

import type { Entry, Flight } from "../../types/dataTypes";
import type { GlobalState, MeetState, LiftingState } from "../../types/stateTypes";

type StateProps = {
  meet: MeetState,
  lifting: LiftingState,
  flightsOnPlatform: Array<Flight>,
  entriesInFlight: Array<Entry>
};

type Props = StateProps;

class LiftingView extends React.Component<Props> {
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
          flightsOnPlatform={this.props.flightsOnPlatform}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  const day = state.lifting.day;
  const platform = state.lifting.platform;
  const flight = state.lifting.flight;

  const entriesOnPlatform = state.registration.entries.filter(
    entry => entry.day === day && entry.platform === platform
  );

  // Determine available flights from the entries themselves.
  let flights: Array<Flight> = [];
  for (let i = 0; i < entriesOnPlatform.length; i++) {
    const entry = entriesOnPlatform[i];
    if (flights.indexOf(entry.flight) === -1) {
      flights.push(entry.flight);
    }
  }
  flights.sort();

  // Only receive entries that are in the currently-lifting group.
  const entriesInFlight = entriesOnPlatform.filter(entry => entry.flight === flight);

  return {
    meet: state.meet,
    lifting: state.lifting,
    flightsOnPlatform: flights,
    entriesInFlight: entriesInFlight
  };
};

export default connect(
  mapStateToProps,
  null
)(LiftingView);
