// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the FlightOrder page,
// contained by the FlightOrderContainer.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, FormControl, Panel } from "react-bootstrap";

import OneFlightOrder from "./OneFlightOrder";

const marginStyle = { margin: "0 20px 0 20px" };

class FlightOrderView extends React.Component {
  constructor(props) {
    super(props);

    this.updateDay = this.updateDay.bind(this);
    this.updatePlatform = this.updatePlatform.bind(this);
    this.handlePrint = this.handlePrint.bind(this);

    // Make options for all of the available days.
    let dayOptions = [];
    for (let i = 1; i <= props.meet.lengthDays; i++) {
      dayOptions.push(
        <option value={i} key={i}>
          Day {i}
        </option>
      );
    }
    this.dayOptions = dayOptions;

    this.state = {
      day: 1,
      platform: 1
    };
  }

  updateDay(event) {
    const day = Number(event.target.value);
    if (this.state.day !== day) {
      // If the currently-selected platform number becomes invalid, reset it.
      if (this.state.platform > this.props.meet.platformsOnDays[day - 1]) {
        this.setState({ day: day, platform: 1 });
      } else {
        this.setState({ day: day });
      }
    }
  }

  updatePlatform(event) {
    const platform = Number(event.target.value);
    if (this.state.platform !== platform) {
      this.setState({ platform: platform });
    }
  }

  handlePrint() {
    window.print();
  }

  render() {
    const selectorStyle = { width: "120px" };

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
              {this.dayOptions}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    meet: state.meet,
    entries: state.registration.entries
  };
};

FlightOrderView.propTypes = {
  meet: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  null
)(FlightOrderView);
