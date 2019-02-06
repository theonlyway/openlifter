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

// Shows the first attempt ordering of lifters for a single flight.

import React from "react";

import { Panel, Table } from "react-bootstrap";

import { liftToAttemptFieldName } from "../../logic/entry";
import { orderEntriesByAttempt } from "../../logic/liftingOrder";

import type { Entry, Flight, Lift } from "../../types/dataTypes";

interface OwnProps {
  flight: Flight;
  entriesInFlight: Array<Entry>;
}

type Props = OwnProps;

class OneFlightOrder extends React.Component<Props> {
  getOrderBy = (lift: Lift): Array<Entry> => {
    const fieldKg = liftToAttemptFieldName(lift);

    // Only consider entries that registered a first attempt.
    const entriesForLift = this.props.entriesInFlight.filter(e => {
      return e[fieldKg][0] !== 0;
    });

    // Sort them in-place on the basis of that first attempt.
    return orderEntriesByAttempt(entriesForLift, fieldKg, 1);
  };

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
            <td key={"S-" + entry.id}>
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
            <td key={"B-" + entry.id}>
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
            <td key={"D-" + entry.id}>
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
      header.push(<th key={"S"}>Squat</th>);
    }
    if (hasBench) {
      header.push(<th key={"B"}>Bench</th>);
    }
    if (hasDeadlift) {
      header.push(<th key={"D"}>Deadlift</th>);
    }

    return (
      <Panel>
        <Panel.Heading>Flight {this.props.flight} Lifting Order</Panel.Heading>
        <Panel.Body>
          <Table striped hover condensed style={{ margin: "0px" }}>
            <thead>
              <tr>{header}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}

export default OneFlightOrder;
