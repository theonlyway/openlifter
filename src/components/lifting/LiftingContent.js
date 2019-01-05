// vim: set ts=2 sts=2 sw=2 et:
//
// The main component of the Lifting page, contained by the LiftingView.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Table } from "react-bootstrap";

class LiftingContent extends React.Component {
  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
  }

  renderAttempt(kg, status) {
    if (status > 0) {
      return <span style={{ color: "green" }}>{kg}</span>;
    }
    if (status < 0) {
      return <span style={{ color: "red" }}>{kg}</span>;
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

      let style = {};
      if (isCurrent) {
        style = { backgroundColor: "yellow" };
      }

      rows.push(
        <tr key={entry.id} style={style}>
          <td>{entry.name}</td>
          <td>{this.renderAttempt(entry.squatKg[0], entry.squatStatus[0])}</td>
          <td>{this.renderAttempt(entry.squatKg[1], entry.squatStatus[1])}</td>
          <td>{this.renderAttempt(entry.squatKg[1], entry.squatStatus[2])}</td>
        </tr>
      );
    }
    return rows;
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Squat1</th>
            <th>Squat2</th>
            <th>Squat3</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

LiftingContent.propTypes = {
  orderedEntries: PropTypes.array.isRequired,
  currentEntryId: PropTypes.number // Can be null.
};

export default connect(
  mapStateToProps,
  null
)(LiftingContent);
