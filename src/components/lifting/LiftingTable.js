// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// The main component of the Lifting page, contained by the LiftingView.

import React from "react";
import { connect } from "react-redux";

import AttemptInput from "./AttemptInput";

import { getWeightClassStr } from "../../reducers/meetReducer.js";
import { liftToAttemptFieldName, liftToStatusFieldName } from "../../reducers/registrationReducer";

import styles from "./LiftingTable.module.scss";

type Props = {
  meet: {
    weightClassesKgMen: Array<number>,
    weightClassesKgWomen: Array<number>
  },
  lifting: {
    lift: string
  },
  orderedEntries: Array<Object>,
  currentEntryId?: number
};

// List of possible columns that can be rendered.
// The main render() function decides what columns to render,
// and communicates its selection with each row's renderer.
type ColumnType =
  | "Name"
  | "Bodyweight"
  | "WeightClass"
  | "Equipment"
  | "S1" | "S2" | "S3" | "S4" // eslint-disable-line
  | "B1" | "B2" | "B3" | "B4" // eslint-disable-line
  | "D1" | "D2" | "D3" | "D4" // eslint-disable-line
  | "BestSquat" | "BestBench" // eslint-disable-line
  | "ProjectedTotal"
  | "Total";

class LiftingTable extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
  }

  renderAttemptField(entry, lift, attemptOneIndexed: number, key: number) {
    const fieldKg = liftToAttemptFieldName(lift);
    const fieldStatus = liftToStatusFieldName(lift);

    const kg = entry[fieldKg][attemptOneIndexed - 1];
    const status = entry[fieldStatus][attemptOneIndexed - 1];

    // If the attempt was already made, render a colored text field.
    // The weight cannot be changed after the fact.
    if (status > 0) {
      return (
        <td key={key} className={styles.goodlift}>
          {kg}
        </td>
      );
    }
    if (status < 0) {
      return (
        <td key={key} className={styles.nolift}>
          -{kg}
        </td>
      );
    }

    // If the attempt isn't for the current lift, just show the number.
    if (lift !== this.props.lifting.lift) {
      if (kg === 0) {
        return <td key={key} />;
      }
      return <td key={key}>{kg}</td>;
    }

    // Was the previous attempt taken yet?
    let prevAttemptAttempted = attemptOneIndexed > 1 && entry[fieldStatus][attemptOneIndexed - 2] !== 0;

    // If the attempt was put it but hasn't occurred yet, show it in a text input.
    // Also if the previous attempt was attempted, show an input for entering
    // the lifter's next attempt.
    if (kg !== 0 || prevAttemptAttempted) {
      return (
        <td key={key} className={styles.attemptInputCell}>
          <AttemptInput entryId={entry.id} lift={lift} attemptOneIndexed={attemptOneIndexed} weightKg={kg} />
        </td>
      );
    }

    // Default handler.
    if (kg === 0) {
      return <td key={key} />;
    }
    return <td key={key}>{kg}</td>;
  }

  renderCell = (entry: Object, columnType: ColumnType, key: number) => {
    switch (columnType) {
      case "Name":
        return <td key={key}>{entry.name}</td>;
      case "Bodyweight":
        return <td key={key}>{entry.bodyweightKg}</td>;
      case "WeightClass": {
        const classesForSex =
          entry.sex === "M" ? this.props.meet.weightClassesKgMen : this.props.meet.weightClassesKgWomen;
        const weightClass = getWeightClassStr(classesForSex, entry.bodyweightKg);
        return <td key={key}>{weightClass}</td>;
      }
      case "Equipment":
        return <td key={key}>{entry.equipment}</td>;
      case "S1":
        return this.renderAttemptField(entry, "S", 1, key);
      case "S2":
        return this.renderAttemptField(entry, "S", 2, key);
      case "S3":
        return this.renderAttemptField(entry, "S", 3, key);
      case "S4":
        return this.renderAttemptField(entry, "S", 4, key);
      case "B1":
        return this.renderAttemptField(entry, "B", 1, key);
      case "B2":
        return this.renderAttemptField(entry, "B", 2, key);
      case "B3":
        return this.renderAttemptField(entry, "B", 3, key);
      case "B4":
        return this.renderAttemptField(entry, "B", 4, key);
      case "D1":
        return this.renderAttemptField(entry, "D", 1, key);
      case "D2":
        return this.renderAttemptField(entry, "D", 2, key);
      case "D3":
        return this.renderAttemptField(entry, "D", 3, key);
      case "D4":
        return this.renderAttemptField(entry, "D", 4, key);
      case "BestSquat":
        return <td key={key}>TODO</td>;
      case "BestBench":
        return <td key={key}>TODO</td>;
      case "ProjectedTotal":
        return <td key={key}>TODO</td>;
      case "Total":
        return <td key={key}>TODO</td>;
      default:
        (columnType: empty); // eslint-disable-line
        return <td />;
    }
  };

  renderRows = (columns: Array<ColumnType>) => {
    const orderedEntries = this.props.orderedEntries;
    const currentEntryId = this.props.currentEntryId;

    let rows = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];

      // Iterate over each columnType, handling each.
      let cells = [];
      for (let col = 0; col < columns.length; col++) {
        const columnType = columns[col];
        cells.push(this.renderCell(entry, columnType, col));
      }

      const isCurrent = entry.id === currentEntryId;
      const rowClassName = isCurrent ? styles.current : "";
      rows.push(
        <tr key={entry.id} className={rowClassName}>
          {cells}
        </tr>
      );
    }
    return rows;
  };

  render() {
    // Select the columns for display.
    let columns: Array<ColumnType> = ["Name", "Bodyweight", "WeightClass", "Equipment"];

    // Select lift columns based off the current lift.
    if (this.props.lifting.lift === "S") {
      columns.push("S1", "S2", "S3", "B1", "D1");
    } else if (this.props.lifting.lift === "B") {
      columns.push("BestSquat", "B1", "B2", "B3", "D1");
    } else if (this.props.lifting.lift === "D") {
      columns.push("BestSquat", "BestBench", "D1", "D2", "D3");
    }
    columns.push("ProjectedTotal");

    // Build headers.
    let headers = [];
    for (let i = 0; i < columns.length; i++) {
      const className = columns[i] === "Name" ? "" : styles.smallCell;
      headers.push(
        <th key={i} className={className}>
          {columns[i]}
        </th>
      );
    }

    return (
      <table className={styles.liftingtable}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{this.renderRows(columns)}</tbody>
      </table>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

export default connect(
  mapStateToProps,
  null
)(LiftingTable);
