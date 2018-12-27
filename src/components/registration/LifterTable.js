// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the table of LifterRows
// Generalized to accept a rowRenderer component, so that different pages
// can render different row level items, while re-using the logic in this component
// to handle rendering one row per lifter
// This is the parent component that determines how many rows to render,
// what data each row should see, etc.

import React from "react";
import PropTypes from "prop-types";

import { Table } from "react-bootstrap";

class LifterTable extends React.Component {
  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  renderRows() {
    const LifterRow = this.props.rowRenderer;
    const { entries } = this.props;
    return entries.map(lifter => <LifterRow key={lifter.id} id={lifter.id} />);
  }

  renderHeader() {
    // Styling for small, single-character selector columns.
    const shortStyle = { width: "75px" };
    return (
      <tr>
        <th style={shortStyle}>Day</th>
        <th style={shortStyle}>Platform</th>
        <th style={shortStyle}>Flight</th>
        <th>Name</th>
        <th style={shortStyle}>Sex</th>
        <th style={{ width: "120px" }}>Equipment</th>
        <th style={{ width: "200px" }}>Division(s)</th>
        <th style={{ width: "150px" }}>Event(s)</th>
        <th style={{ width: "80px" }} />
      </tr>
    );
  }

  render() {
    return (
      <Table>
        <thead>{this.renderHeader()}</thead>
        <tbody>{this.renderRows()}</tbody>
      </Table>
    );
  }
}

LifterTable.propTypes = {
  entries: PropTypes.array.isRequired,
  rowRenderer: PropTypes.any.isRequired
};

export default LifterTable;
