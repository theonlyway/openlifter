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
import { FormattedMessage } from "react-intl";

import Card from "react-bootstrap/Card";

import LeftCard from "./LeftCard";
import LiftingFooter from "./LiftingFooter";
import LiftingHeader from "./LiftingHeader";
import LiftingTable from "./LiftingTable";
import WeighinsView from "../weighins/WeighinsView";

import ColumnWidth from "./ColumnWidth";

import { getString } from "../../logic/strings";

import styles from "./LiftingView.module.scss";

import { getLiftingOrder } from "../../logic/liftingOrder";

import { Entry, Flight, Language } from "../../types/dataTypes";
import { GlobalState, MeetState, LiftingState } from "../../types/stateTypes";

interface StateProps {
  meet: MeetState;
  lifting: LiftingState;
  flightsOnPlatform: Array<Flight>;
  entriesInFlight: Array<Entry>;
  language: Language;
}

type Props = StateProps;

interface InternalState {
  // If true, the LiftingTable is replaced with the Weighins page.
  // This lets the score table change arbitrary rack height and attempt information
  // without removing the current lifter or bar load displays.
  replaceTableWithWeighins: boolean;
}

class LiftingView extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);
    this.toggleReplaceTableWithWeighins = this.toggleReplaceTableWithWeighins.bind(this);
    this.state = {
      replaceTableWithWeighins: false
    };
  }

  toggleReplaceTableWithWeighins = (): void => {
    this.setState({
      replaceTableWithWeighins: !this.state.replaceTableWithWeighins
    });
  };

  render() {
    const now = getLiftingOrder(this.props.entriesInFlight, this.props.lifting);

    let rightElement = null;
    if (this.state.replaceTableWithWeighins === false) {
      rightElement = (
        <LiftingTable
          attemptOneIndexed={now.attemptOneIndexed}
          orderedEntries={now.orderedEntries}
          currentEntryId={now.currentEntryId}
        />
      );
    } else {
      rightElement = (
        <WeighinsView day={this.props.lifting.day} platform={this.props.lifting.platform} inLiftingPage={true} />
      );
    }

    return (
      <div>
        <Card border="dark" style={{ margin: "12px 20px" }}>
          <Card.Body>
            <div style={{ width: "160px" }}>
              <ColumnWidth
                label={getString("lifting.division-column-width-label", this.props.language)}
                fieldName="columnDivisionWidthPx"
              />
            </div>
            <h3>
              <FormattedMessage
                id="lifting.garish-instructions"
                defaultMessage="To fit to the screen, zoom the browser in or out and then press Toggle Fullscreen."
              />
            </h3>
          </Card.Body>
        </Card>
        <div id="liftingView" className={styles.liftingView}>
          <LiftingHeader
            attemptOneIndexed={now.attemptOneIndexed}
            orderedEntries={now.orderedEntries}
            currentEntryId={now.currentEntryId}
          />

          <div className={styles.middleParentContainer}>
            <div className={styles.leftCardContainer}>
              <LeftCard
                attemptOneIndexed={now.attemptOneIndexed}
                orderedEntries={now.orderedEntries}
                currentEntryId={now.currentEntryId}
                nextEntryId={now.nextEntryId}
                nextAttemptOneIndexed={now.nextAttemptOneIndexed}
              />
            </div>

            <div className={styles.rightCardContainer}>{rightElement}</div>
          </div>

          <LiftingFooter
            attemptOneIndexed={now.attemptOneIndexed}
            orderedEntries={now.orderedEntries}
            currentEntryId={now.currentEntryId}
            flightsOnPlatform={this.props.flightsOnPlatform}
            toggleReplaceTableWithWeighins={this.toggleReplaceTableWithWeighins}
          />
        </div>
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
    entriesInFlight: entriesInFlight,
    language: state.language
  };
};

export default connect(mapStateToProps)(LiftingView);
