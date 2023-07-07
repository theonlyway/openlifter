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

// Shows the first attempt ordering of lifters for a single flight.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import { liftToAttemptFieldName } from "../../logic/entry";
import { orderEntriesByAttempt } from "../../logic/liftingOrder";
import { getString, localizeFlight } from "../../logic/strings";
import { kg2lbs, displayNumber, displayWeight } from "../../logic/units";

import { Entry, Flight, Language, Lift } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";

import styles from "./OneFlightOrder.module.scss";

type Column =
  | "SquatName"
  | "SquatKg"
  | "SquatLbs"
  | "BenchSeparator"
  | "BenchName"
  | "BenchKg"
  | "BenchLbs"
  | "DeadliftSeparator"
  | "DeadliftName"
  | "DeadliftKg"
  | "DeadliftLbs";

interface OwnProps {
  flight: Flight;
  entriesInFlight: Array<Entry>;
}

interface StateProps {
  inKg: boolean;
  showAlternateUnits: boolean;
  language: Language;
}

type Props = OwnProps & StateProps;

class OneFlightOrder extends React.Component<Props> {
  getOrderBy = (lift: Lift): Array<Entry> => {
    const fieldKg = liftToAttemptFieldName(lift);

    // Only consider entries that registered a first attempt.
    const entriesForLift = this.props.entriesInFlight.filter((e) => {
      return e[fieldKg][0] !== 0;
    });

    // Sort them in-place on the basis of that first attempt.
    return orderEntriesByAttempt(entriesForLift, fieldKg, 1);
  };

  getColumnHeader(column: Column, language: Language): string {
    switch (column) {
      case "SquatName":
        return getString("flight-order.squat-column-header", language);
      case "SquatKg":
        return getString("flight-order.kilograms-header", language);
      case "SquatLbs":
        return getString("flight-order.pounds-header", language);
      case "BenchSeparator":
        return "";
      case "BenchName":
        return getString("flight-order.bench-column-header", language);
      case "BenchKg":
        return getString("flight-order.kilograms-header", language);
      case "BenchLbs":
        return getString("flight-order.pounds-header", language);
      case "DeadliftSeparator":
        return "";
      case "DeadliftName":
        return getString("flight-order.deadlift-column-header", language);
      case "DeadliftKg":
        return getString("flight-order.kilograms-header", language);
      case "DeadliftLbs":
        return getString("flight-order.pounds-header", language);
      default:
        checkExhausted(column);
        return "";
    }
  }

  renderName(position: number, entry: Entry, language: Language): string {
    return `${displayNumber(position + 1, language)}. ${entry.name} (${entry.divisions.join(", ")})`;
  }

  render() {
    const language = this.props.language;

    const bySquat = this.getOrderBy("S");
    const byBench = this.getOrderBy("B");
    const byDeadlift = this.getOrderBy("D");

    const hasSquat = bySquat.length !== 0;
    const hasBench = byBench.length !== 0;
    const hasDeadlift = byDeadlift.length !== 0;

    const maxRows = Math.max(bySquat.length, byBench.length, byDeadlift.length);

    // Figure out what columns to render, and in which order.
    const columns: Array<Column> = [];
    if (hasSquat) {
      columns.push("SquatName");
      columns.push(this.props.inKg ? "SquatKg" : "SquatLbs");
      if (this.props.showAlternateUnits) {
        columns.push(this.props.inKg ? "SquatLbs" : "SquatKg");
      }
    }
    if (hasBench) {
      if (hasSquat) {
        columns.push("BenchSeparator");
      }
      columns.push("BenchName");
      columns.push(this.props.inKg ? "BenchKg" : "BenchLbs");
      if (this.props.showAlternateUnits) {
        columns.push(this.props.inKg ? "BenchLbs" : "BenchKg");
      }
    }
    if (hasDeadlift) {
      if (hasSquat || hasBench) {
        columns.push("DeadliftSeparator");
      }
      columns.push("DeadliftName");
      columns.push(this.props.inKg ? "DeadliftKg" : "DeadliftLbs");
      if (this.props.showAlternateUnits) {
        columns.push(this.props.inKg ? "DeadliftLbs" : "DeadliftKg");
      }
    }

    // Construct a table row-by-row.
    const rows = [];
    for (let i = 0; i < maxRows; ++i) {
      const builder = [];

      for (let j = 0; j < columns.length; ++j) {
        const column = columns[j];
        const key: string = column + String(i);

        let content: string = "";
        let className = undefined;

        switch (column) {
          case "SquatName": {
            if (i < bySquat.length) {
              const entry = bySquat[i];
              content = this.renderName(i, entry, language);
            }
            break;
          }
          case "SquatKg": {
            if (i < bySquat.length) {
              const entry = bySquat[i];
              content = displayWeight(entry.squatKg[0], language);
            }
            break;
          }
          case "SquatLbs": {
            if (i < bySquat.length) {
              const entry = bySquat[i];
              content = displayWeight(kg2lbs(entry.squatKg[0]), language);
            }
            break;
          }
          case "BenchSeparator":
            className = styles.leftDivider;
            break;
          case "BenchName": {
            if (i < byBench.length) {
              const entry = byBench[i];
              content = this.renderName(i, entry, language);
            }
            break;
          }
          case "BenchKg": {
            if (i < byBench.length) {
              const entry = byBench[i];
              content = displayWeight(entry.benchKg[0], language);
            }
            break;
          }
          case "BenchLbs": {
            if (i < byBench.length) {
              const entry = byBench[i];
              content = displayWeight(kg2lbs(entry.benchKg[0]), language);
            }
            break;
          }
          case "DeadliftSeparator":
            className = styles.leftDivider;
            break;
          case "DeadliftName": {
            if (i < byDeadlift.length) {
              const entry = byDeadlift[i];
              content = this.renderName(i, entry, language);
            }
            break;
          }
          case "DeadliftKg": {
            if (i < byDeadlift.length) {
              const entry = byDeadlift[i];
              content = displayWeight(entry.deadliftKg[0], language);
            }
            break;
          }
          case "DeadliftLbs": {
            if (i < byDeadlift.length) {
              const entry = byDeadlift[i];
              content = displayWeight(kg2lbs(entry.deadliftKg[0]), language);
            }
            break;
          }
        }

        builder.push(
          <td key={key} className={className}>
            {content}
          </td>,
        );
      }

      rows.push(<tr key={i}>{builder}</tr>);
    }

    // Construct the table header.
    const header = [];
    for (let i = 0; i < columns.length; ++i) {
      const column = columns[i];
      const title = this.getColumnHeader(column, this.props.language);
      header.push(<th key={column}>{title}</th>);
    }

    return (
      <Card>
        <Card.Header>
          <FormattedMessage
            id="flight-order.flight-card"
            defaultMessage="Flight {flight} Lifting Order"
            values={{ flight: localizeFlight(this.props.flight, this.props.language) }}
          />
        </Card.Header>
        <Card.Body>
          <Table striped hover size="sm" style={{ margin: "0px" }}>
            <thead>
              <tr>{header}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    inKg: state.meet.inKg,
    showAlternateUnits: state.meet.showAlternateUnits,
    language: state.language,
  };
};

export default connect(mapStateToProps)(OneFlightOrder);
