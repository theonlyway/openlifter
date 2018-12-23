// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the table of LifterRows on the Registration page.
// This is the parent component that determines how many rows to render,
// what data each row should see, etc.

import React from "react";
import { connect } from "react-redux";
import LifterRow from "./LifterRow";

class LifterTable extends React.Component {
  constructor() {
    super();
    this.renderRows = this.renderRows.bind(this);
  }

  renderRows() {
    const numEntries = this.props.registration.entries.length;

    let rows = [];
    for (let i = 0; i < numEntries; i++) {
      let entry = this.props.registration.entries[i];

      rows.push(<LifterRow key={entry.id} id={entry.id} />);
    }
    return rows;
  }

  render() {
    return <div>{this.renderRows()}</div>;
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(LifterTable);
