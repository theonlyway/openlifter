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

  renderRows() {
    const { orderedEntries } = this.props;
    return orderedEntries.map(entry => (
      <tr key={entry.id}>
        <td>{entry.name}</td>
        <td>{entry.squatKg[0]}</td>
        <td>{entry.squatKg[1]}</td>
        <td>{entry.squatKg[2]}</td>
      </tr>
    ));
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
  orderedEntries: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  null
)(LiftingContent);
