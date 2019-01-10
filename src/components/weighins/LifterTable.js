// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    return entries.map(entry => <LifterRow key={entry.id} id={entry.id} />);
  }

  renderHeader() {
    // Styling for small, single-character selector columns.
    const shortStyle = { width: "80px" };

    const units = this.props.inKg ? "Kg" : "Lbs";

    return (
      <tr>
        <th style={shortStyle}>Platform</th>
        <th style={shortStyle}>Flight</th>
        <th>Name</th>

        <th style={shortStyle}>Bodyweight {units}</th>
        <th style={shortStyle}>Squat Rack</th>
        <th style={shortStyle}>Squat Opener {units}</th>
        <th style={shortStyle}>Bench Rack</th>
        <th style={shortStyle}>Bench Opener {units}</th>
        <th style={shortStyle}>Deadlift Opener {units}</th>
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

const mapStateToProps = state => ({
  inKg: state.meet.inKg
});

LifterTable.propTypes = {
  inKg: PropTypes.bool.isRequired,
  entries: PropTypes.array.isRequired,
  rowRenderer: PropTypes.any.isRequired
};

export default connect(
  mapStateToProps,
  null
)(LifterTable);
