// vim: set ts=2 sts=2 sw=2 et:
//
// The main component of the Lifting page, contained by the LiftingView.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AttemptInput from "./AttemptInput";

import { getWeightClassStr } from "../../reducers/meetReducer.js";
import { liftToAttemptFieldName, liftToStatusFieldName } from "../../reducers/registrationReducer";

import styles from "./LiftingTable.module.scss";

class LiftingTable extends React.Component {
  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
  }

  renderAttemptField(entry, lift, attemptOneIndexed) {
    const fieldKg = liftToAttemptFieldName(lift);
    const fieldStatus = liftToStatusFieldName(lift);

    const kg = entry[fieldKg][attemptOneIndexed - 1];
    const status = entry[fieldStatus][attemptOneIndexed - 1];

    // If the attempt was already made, render a colored text field.
    // The weight cannot be changed after the fact.
    if (status > 0) {
      return <span style={{ color: "green" }}>{kg}</span>;
    }
    if (status < 0) {
      return <span style={{ color: "red" }}>-{kg}</span>;
    }

    // If the attempt isn't for the current lift, just show the number.
    if (lift !== this.props.lifting.lift) {
      if (kg === 0) {
        return <span />;
      }
      return <span>{kg}</span>;
    }

    // Was the previous attempt taken yet?
    let prevAttemptAttempted = attemptOneIndexed > 1 && entry[fieldStatus][attemptOneIndexed - 2] !== 0;

    // If the attempt was put it but hasn't occurred yet, show it in a text input.
    // Also if the previous attempt was attempted, show an input for entering
    // the lifter's next attempt.
    if (kg !== 0 || prevAttemptAttempted) {
      return <AttemptInput entryId={entry.id} lift={lift} attemptOneIndexed={attemptOneIndexed} weightKg={kg} />;
    }

    // Default handler.
    if (kg === 0) {
      return <span />;
    }
    return <span>{kg}</span>;
  }

  renderRows() {
    const orderedEntries = this.props.orderedEntries;
    const currentEntryId = this.props.currentEntryId;

    let rows = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const entry = orderedEntries[i];
      const isCurrent = entry.id === currentEntryId;

      const classesForSex =
        entry.sex === "M" ? this.props.meet.weightClassesKgMen : this.props.meet.weightClassesKgWomen;
      const weightClass = getWeightClassStr(classesForSex, entry.bodyweightKg);

      let style = {};
      if (isCurrent) {
        style = { backgroundColor: "yellow" };
      }

      rows.push(
        <tr key={entry.id} style={style}>
          <td>{entry.name}</td>

          <td>{entry.bodyweightKg}</td>
          <td>{weightClass}</td>
          <td>{entry.equipment}</td>

          <td>{this.renderAttemptField(entry, "S", 1)}</td>
          <td>{this.renderAttemptField(entry, "S", 2)}</td>
          <td>{this.renderAttemptField(entry, "S", 3)}</td>

          <td>{this.renderAttemptField(entry, "B", 1)}</td>
          <td>{this.renderAttemptField(entry, "B", 2)}</td>
          <td>{this.renderAttemptField(entry, "B", 3)}</td>

          <td>{this.renderAttemptField(entry, "D", 1)}</td>
          <td>{this.renderAttemptField(entry, "D", 2)}</td>
          <td>{this.renderAttemptField(entry, "D", 3)}</td>
        </tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <table className={styles.liftingtable}>
        <thead>
          <tr>
            <th>Name</th>
            <th className={styles.smallCell}>Bwt</th>
            <th className={styles.smallCell}>Cls</th>
            <th className={styles.smallCell}>Equip</th>
            <th className={styles.smallCell}>S1</th>
            <th className={styles.smallCell}>S2</th>
            <th className={styles.smallCell}>S3</th>
            <th className={styles.smallCell}>B1</th>
            <th className={styles.smallCell}>B2</th>
            <th className={styles.smallCell}>B3</th>
            <th className={styles.smallCell}>D1</th>
            <th className={styles.smallCell}>D2</th>
            <th className={styles.smallCell}>D3</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

LiftingTable.propTypes = {
  meet: PropTypes.shape({
    weightClassesKgMen: PropTypes.array.isRequired,
    weightClassesKgWomen: PropTypes.array.isRequired
  }),
  lifting: PropTypes.shape({
    lift: PropTypes.string.isRequired
  }),
  orderedEntries: PropTypes.array.isRequired,
  currentEntryId: PropTypes.number // Can be null.
};

export default connect(
  mapStateToProps,
  null
)(LiftingTable);
