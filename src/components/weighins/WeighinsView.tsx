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

// The parent component of the Weigh-ins page, contained by the WeighinsContainer.
// The Weigh-ins page updates more information in the Registration state.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Card from "react-bootstrap/Card";

import { getLiftersOnDay } from "../../logic/entry";
import LifterTable from "./LifterTable";
import LifterRow from "./LifterRow";

import { Entry } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

// For use when embedded inside the Lifting page.
interface OwnProps {
  day?: number;
  platform?: number;
  inLiftingPage?: boolean; // The weigh-ins page can be embedded.
}

interface StateProps {
  entries: ReadonlyArray<Entry>;
}

type Props = Readonly<OwnProps> & Readonly<StateProps>;

class WeighinsView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.getNumDaysFromEntries = this.getNumDaysFromEntries.bind(this);
  }

  // Figure out how many days there are by looking at the entries themselves.
  //
  // The meet page information may be unreliable: someone might have created
  // a second day, added a lifter to it, then removed the second day without
  // yet updating that lifter.
  //
  // This is an attempt to make that error more obvious, so it can be corrected.
  getNumDaysFromEntries = () => {
    let max_day = 0;
    const entries = this.props.entries;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.day > max_day) {
        max_day = entry.day;
      }
    }
    return max_day;
  };

  render() {
    // Determine whether this is being shown embedded in the Lifting page.
    const inLiftingPage = this.props.inLiftingPage === true;

    // Make a separate panel for each day.
    const numDays = this.getNumDaysFromEntries();
    const dayCards = [];
    for (let i = 1; i <= numDays; i++) {
      const lifters = getLiftersOnDay(this.props.entries, i);

      // Skip if the OwnProps excluded this selection.
      if (lifters.length === 0) {
        continue;
      }

      // Present the lifters in sorted order.
      lifters.sort((a, b) => {
        if (a.platform !== b.platform) return a.platform - b.platform;
        if (a.flight !== b.flight) return a.flight < b.flight ? -1 : 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      dayCards.push(
        <Card key={i} style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage
              id="weigh-ins.day-header"
              defaultMessage="Day {dayNumber} Weigh-ins"
              values={{ dayNumber: i }}
            />
          </Card.Header>
          <Card.Body>
            <LifterTable entries={lifters} rowRenderer={LifterRow} inLiftingPage={inLiftingPage} />
          </Card.Body>
        </Card>,
      );
    }

    // If there are no days thus far, show a default warning panel.
    if (dayCards.length === 0) {
      dayCards.push(
        <Card key={0}>
          <Card.Header>
            <FormattedMessage id="weigh-ins.empty-header" defaultMessage="Waiting for Registration" />
          </Card.Header>
          <Card.Body>
            <FormattedMessage
              id="weigh-ins.empty-body"
              defaultMessage="Add lifters on the Registration page before weighing them in."
            />
          </Card.Body>
        </Card>,
      );
    }

    return <div>{dayCards}</div>;
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  const { day, platform } = ownProps;
  let entries = state.registration.entries;

  // Filter if requested by the OwnProps.
  if (typeof day === "number" && typeof platform === "number") {
    entries = entries.filter((e) => e.day === day && e.platform === platform);
  }

  return { entries };
};

export default connect(mapStateToProps)(WeighinsView);
