// vim: set ts=2 sts=2 sw=2 et:
//
// Shows the first attempt ordering of lifters for a single flight.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Panel, Table } from "react-bootstrap";

import { liftToAttemptFieldName, orderEntriesByAttempt } from "../../reducers/registrationReducer.js";

class FlightOrderView extends React.Component {
  getOrderBy(lift) {
    const fieldKg = liftToAttemptFieldName(lift);

    // Only consider entries that registered a first attempt.
    const entriesForLift = this.props.entriesInFlight.filter(e => {
      return e[fieldKg][0] !== 0;
    });

    // Sort them in-place on the basis of that first attempt.
    return orderEntriesByAttempt(entriesForLift, fieldKg, 1);
  }

  render() {
    const bySquat = this.getOrderBy("S");
    const byBench = this.getOrderBy("B");
    const byDeadlift = this.getOrderBy("D");

    const hasSquat = bySquat.length !== 0;
    const hasBench = byBench.length !== 0;
    const hasDeadlift = byDeadlift.length !== 0;

    const maxRows = Math.max(bySquat.length, byBench.length, byDeadlift.length);

    // Construct a table row-by-row.
    let rows = [];
    for (let i = 0; i < maxRows; i++) {
      let builder = [];
      let key = 0;

      if (hasSquat) {
        if (i < bySquat.length) {
          const entry = bySquat[i];
          const weight = entry.squatKg[0];
          builder.push(
            <td key={key++}>
              {i + 1}. {entry.name} ({weight})
            </td>
          );
        } else {
          builder.push(<td key={key++} />);
        }
      }

      if (hasBench) {
        if (i < byBench.length) {
          const entry = byBench[i];
          const weight = entry.benchKg[0];
          builder.push(
            <td key={key++}>
              {i + 1}. {entry.name} ({weight})
            </td>
          );
        } else {
          builder.push(<td key={key++} />);
        }
      }

      if (hasDeadlift) {
        if (i < byDeadlift.length) {
          const entry = byDeadlift[i];
          const weight = entry.deadliftKg[0];
          builder.push(
            <td key={key++}>
              {i + 1}. {entry.name} ({weight})
            </td>
          );
        } else {
          builder.push(<td key={key++} />);
        }
      }

      rows.push(<tr key={i}>{builder}</tr>);
    }

    // Construct the table header.
    let header = [];
    if (hasSquat) {
      header.push(<th key={0}>Squat</th>);
    }
    if (hasBench) {
      header.push(<th key={1}>Bench</th>);
    }
    if (hasDeadlift) {
      header.push(<th key={2}>Deadlift</th>);
    }

    return (
      <Panel>
        <Panel.Heading>Flight {this.props.flight}</Panel.Heading>
        <Panel.Body>
          <Table striped hover>
            <thead>{header}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}

FlightOrderView.propTypes = {
  // ownProps.
  flight: PropTypes.string.isRequired,
  entriesInFlight: PropTypes.array.isRequired
};

export default connect(
  null,
  null
)(FlightOrderView);
