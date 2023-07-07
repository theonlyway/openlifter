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

// The parent component of the FlightOrder page, contained by the FlightOrderContainer.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";

import OneFlightOrder from "./OneFlightOrder";

import { getString } from "../../logic/strings";
import { displayNumber } from "../../logic/units";

import { Entry, Flight, Language } from "../../types/dataTypes";
import { GlobalState, MeetState } from "../../types/stateTypes";

interface StateProps {
  meet: MeetState;
  entries: ReadonlyArray<Entry>;
  language: Language;
}

type Props = StateProps;

interface InternalState {
  day: number;
  platform: number;
}

class FlightOrderView extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.updateDay = this.updateDay.bind(this);
    this.updatePlatform = this.updatePlatform.bind(this);
    this.handlePrint = this.handlePrint.bind(this);

    this.state = {
      day: 1,
      platform: 1,
    };
  }

  updateDay = (event: React.BaseSyntheticEvent) => {
    const day = Number(event.currentTarget.value);
    if (this.state.day !== day) {
      // If the currently-selected platform number becomes invalid, reset it.
      if (this.state.platform > this.props.meet.platformsOnDays[day - 1]) {
        this.setState({ day: day, platform: 1 });
      } else {
        this.setState({ day: day });
      }
    }
  };

  updatePlatform = (event: React.BaseSyntheticEvent) => {
    const platform = Number(event.currentTarget.value);
    if (this.state.platform !== platform) {
      this.setState({ platform: platform });
    }
  };

  handlePrint = () => {
    window.print();
  };

  render() {
    const language = this.props.language;
    const selectorStyle = { width: "120px", marginRight: "15px" };

    // Make options for all of the days.
    const dayOptions = [];
    const dayTemplate = getString("lifting.footer-day-template", language);
    for (let i = 1; i <= this.props.meet.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          {dayTemplate.replace("{N}", displayNumber(i, language))}
        </option>,
      );
    }

    // Make options for all of the available platforms on the current day.
    const platformOptions = [];
    const platformTemplate = getString("lifting.footer-platform-template", language);
    const numPlatforms = this.props.meet.platformsOnDays[this.state.day - 1];
    for (let i = 1; i <= numPlatforms; i++) {
      platformOptions.push(
        <option value={i} key={i}>
          {platformTemplate.replace("{N}", displayNumber(i, language))}
        </option>,
      );
    }

    // Get all the entries under the current (day, platform) selection.
    const shownEntries = this.props.entries.filter((e) => {
      return e.day === this.state.day && e.platform === this.state.platform;
    });

    // Look through the entries to discover what flights exist.
    const knownFlights: Flight[] = [];
    for (let i = 0; i < shownEntries.length; i++) {
      const entry = shownEntries[i];
      if (knownFlights.indexOf(entry.flight) === -1) {
        knownFlights.push(entry.flight);
      }
    }
    knownFlights.sort();

    // For each flight, see if there are any lifters, and build a OneFlightOrder.
    const flightOrders = [];
    for (let i = 0; i < knownFlights.length; i++) {
      const flight = knownFlights[i];
      const entriesInFlight = shownEntries.filter((e) => e.flight === flight);
      const id = "" + this.state.day + "-" + this.state.platform + "-" + flight;
      flightOrders.push(<OneFlightOrder key={id} flight={flight} entriesInFlight={entriesInFlight} />);
    }

    // FIXME: Disable categories for the moment. They seem unhelpful.
    // As far as I know, no one has paid them much attention.
    /*
    // Look through the entries to discover what divisions exist.
    const categoryResults = getProjectedResults(
      shownEntries,
      this.props.meet.weightClassesKgMen,
      this.props.meet.weightClassesKgWomen,
      this.props.meet.weightClassesKgMx,
      this.props.meet.combineSleevesAndWraps
    );

    let categories: Array<JSX.Element> = [];
    for (let i = 0; i < categoryResults.length; i++) {
      const id = "" + this.state.day + "-" + this.state.platform + "-" + i;
      categories.push(<OneCategory key={id} platform={this.state.platform} categoryResults={categoryResults[i]} />);
    }
    */

    return (
      <div>
        <Card style={{ marginBottom: "17px" }}>
          <Card.Body style={{ display: "flex" }}>
            <FormControl
              value={this.state.day.toString()}
              as="select"
              onChange={this.updateDay}
              style={selectorStyle}
              className="custom-select"
            >
              {dayOptions}
            </FormControl>

            <FormControl
              value={this.state.platform.toString()}
              as="select"
              onChange={this.updatePlatform}
              style={selectorStyle}
              className="custom-select"
            >
              {platformOptions}
            </FormControl>

            <Button variant="info" onClick={this.handlePrint}>
              <FormattedMessage id="flight-order.print-button" defaultMessage="Print Page" />
            </Button>
          </Card.Body>
        </Card>

        {flightOrders}
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    meet: state.meet,
    entries: state.registration.entries,
    language: state.language,
  };
};

export default connect(mapStateToProps)(FlightOrderView);
