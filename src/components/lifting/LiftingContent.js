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
      return <span style={{ color: "red" }}>-{kg}</span>;
    }

    if (kg === 0) {
      return <span></span>;
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

          <td>{this.renderAttempt(entry.benchKg[0], entry.benchStatus[0])}</td>
          <td>{this.renderAttempt(entry.benchKg[1], entry.benchStatus[1])}</td>
          <td>{this.renderAttempt(entry.benchKg[1], entry.benchStatus[2])}</td>

          <td>{this.renderAttempt(entry.deadliftKg[0], entry.deadliftStatus[0])}</td>
          <td>{this.renderAttempt(entry.deadliftKg[1], entry.deadliftStatus[1])}</td>
          <td>{this.renderAttempt(entry.deadliftKg[1], entry.deadliftStatus[2])}</td>
        </tr>
      );
    }
    return rows;
  }

  render() {
    const shortStyle = { width: "75px" };

    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th style={shortStyle}>S1</th>
            <th style={shortStyle}>S2</th>
            <th style={shortStyle}>S3</th>
            <th style={shortStyle}>B1</th>
            <th style={shortStyle}>B2</th>
            <th style={shortStyle}>B3</th>
            <th style={shortStyle}>D1</th>
            <th style={shortStyle}>D2</th>
            <th style={shortStyle}>D3</th>
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
