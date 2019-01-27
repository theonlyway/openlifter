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
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import { getLiftersOnDay } from "../../logic/entry";
import LifterTable from "./LifterTable";
import LifterRow from "./LifterRow";

const marginStyle = { margin: "0 20px 0 20px" };

class WeighinsView extends React.Component {
  constructor(props) {
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
  getNumDaysFromEntries() {
    let max_day = 0;
    const entries = this.props.registration.entries;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.day > max_day) {
        max_day = entry.day;
      }
    }
    return max_day;
  }

  render() {
    // Make a separate panel for each day.
    const numDays = this.getNumDaysFromEntries();
    let dayPanels = [];
    for (let i = 1; i <= numDays; i++) {
      const lifters = getLiftersOnDay(this.props.registration.entries, i);

      // Present the lifters in sorted order.
      lifters.sort((a, b) => {
        if (a.platform !== b.platform) return a.platform - b.platform;
        if (a.flight !== b.flight) return a.flight < b.flight ? -1 : 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      dayPanels.push(
        <Panel key={i}>
          <Panel.Heading>Day {i} Weigh-ins</Panel.Heading>
          <Panel.Body>
            <LifterTable entries={lifters} rowRenderer={LifterRow} />
          </Panel.Body>
        </Panel>
      );
    }

    // If there are no days thus far, show a default warning panel.
    if (dayPanels.length === 0) {
      dayPanels.push(
        <Panel key={0} bsStyle="info">
          <Panel.Heading>Waiting for Registration</Panel.Heading>
          <Panel.Body>Add lifters on the Registration page before weighing them in.</Panel.Body>
        </Panel>
      );
    }

    return <div style={marginStyle}>{dayPanels}</div>;
  }
}

const mapStateToProps = state => ({
  ...state
});

WeighinsView.propTypes = {
  registration: PropTypes.shape({
    entries: PropTypes.array
  })
};

export default connect(
  mapStateToProps,
  null
)(WeighinsView);
