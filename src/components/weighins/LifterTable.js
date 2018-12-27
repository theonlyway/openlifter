// vim: set ts=2 sts=2 sw=2 et:

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
    const shortStyle = { width: "80px" };
    return (
      <tr>
        <th style={shortStyle}>Platform</th>
        <th style={shortStyle}>Flight</th>
        <th>Name</th>

        <th>Bodyweight</th>
        <th>Squat Opener</th>
        <th style={shortStyle}>Squat Rack</th>
        <th>Bench Opener</th>
        <th style={shortStyle}>Bench Rack</th>
        <th>Deadlift Opener</th>
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
