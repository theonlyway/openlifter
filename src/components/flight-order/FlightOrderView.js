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

// The parent component of the FlightOrder page, contained by the FlightOrderContainer.

import React from "react";
import { connect } from "react-redux";

import { Button, FormControl, Panel } from "react-bootstrap";

import OneFlightOrder from "./OneFlightOrder";
import OneCategory from "./OneCategory";

import { getProjectedResults } from "../../logic/divisionPlace";

import type { Entry } from "../../types/dataTypes";
import type { GlobalState, MeetState } from "../../types/stateTypes";

interface StateProps {
  meet: MeetState;
  entries: Array<Entry>;
}

type Props = StateProps;

interface InternalState {
  day: number;
  platform: number;
}

const marginStyle = { margin: "0" };

class FlightOrderView extends React.Component<Props, InternalState> {
  constructor(props) {
    super(props);

    this.updateDay = this.updateDay.bind(this);
    this.updatePlatform = this.updatePlatform.bind(this);
    this.handlePrint = this.handlePrint.bind(this);

    this.state = {
      day: 1,
      platform: 1
    };
  }

  updateDay = event => {
    const day = Number(event.target.value);
    if (this.state.day !== day) {
      // If the currently-selected platform number becomes invalid, reset it.
      if (this.state.platform > this.props.meet.platformsOnDays[day - 1]) {
        this.setState({ day: day, platform: 1 });
      } else {
        this.setState({ day: day });
      }
    }
  };

  updatePlatform = event => {
    const platform = Number(event.target.value);
    if (this.state.platform !== platform) {
      this.setState({ platform: platform });
    }
  };

  handlePrint = () => {
    window.print();
  };

  render() {
    const selectorStyle = { width: "120px" };

    // Make options for all of the days.
    let dayOptions = [];
    for (let i = 1; i <= this.props.meet.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          Day {i}
        </option>
      );
    }

    // Make options for all of the available platforms on the current day.
    let platformOptions = [];
    let numPlatforms = this.props.meet.platformsOnDays[this.state.day - 1];
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          Platform {i}
        </option>
      );
    }

    // Get all the entries under the current (day, platform) selection.
    let shownEntries = this.props.entries.filter(e => {
      return e.day === this.state.day && e.platform === this.state.platform;
    });

    // Look through the entries to discover what flights exist.
    let knownFlights = [];
    for (let i = 0; i < shownEntries.length; i++) {
      const entry = shownEntries[i];
      if (knownFlights.indexOf(entry.flight) === -1) {
        knownFlights.push(entry.flight);
      }
    }
    knownFlights.sort();

    // For each flight, see if there are any lifters, and build a OneFlightOrder.
    let flightOrders = [];
    for (let i = 0; i < knownFlights.length; i++) {
      const flight = knownFlights[i];
      const entriesInFlight = shownEntries.filter(e => e.flight === flight);
      const id = "" + this.state.day + "-" + this.state.platform + "-" + flight;
      flightOrders.push(<OneFlightOrder key={id} flight={flight} entriesInFlight={entriesInFlight} />);
    }

    // Look through the entries to discover what divisions exist.
    const categoryResults = getProjectedResults(
      shownEntries,
      this.props.meet.weightClassesKgMen,
      this.props.meet.weightClassesKgWomen,
      this.props.meet.weightClassesKgMx,
      this.props.meet.areWrapsRaw
    );

    let categories = [];
    for (let i = 0; i < categoryResults.length; i++) {
      const id = "" + this.state.day + "-" + this.state.platform + "-" + i;
      categories.push(<OneCategory key={id} platform={this.state.platform} categoryResults={categoryResults[i]} />);
    }

    return (
      <div style={marginStyle}>
        <Panel bsStyle="info">
          <Panel.Body style={{ display: "flex" }}>
            <FormControl
              defaultValue={this.state.day}
              componentClass="select"
              onChange={this.updateDay}
              style={selectorStyle}
            >
              {dayOptions}
            </FormControl>

            <FormControl
              defaultValue={this.state.platform}
              componentClass="select"
              onChange={this.updatePlatform}
              style={selectorStyle}
            >
              {platformOptions}
            </FormControl>

            <Button bsStyle="info" onClick={this.handlePrint}>
              Print Page
            </Button>
          </Panel.Body>
        </Panel>

        {flightOrders}
        {categories}
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    meet: state.meet,
    entries: state.registration.entries
  };
};

export default connect(
  mapStateToProps,
  null
)(FlightOrderView);
