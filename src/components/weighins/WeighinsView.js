// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Weigh-ins page, contained by the WeighinsContainer.
// The Weigh-ins page updates more information in the Registration state.

import React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";

const marginStyle = { margin: "0 40px 0 40px" };

class WeighinsView extends React.Component {
  constructor() {
    super();
    this.getNumDaysFromEntries = this.getNumDaysFromEntries.bind(this);
  }

  // Figure out how many days there are by looking at the entries themselves.
  //
  // The meet page information may be unreliable: someone might have created
  // a second day, added a lifter to it, then removed the second day without
  // yet updating that lifter.
  //
  // This is an attempt to make that error more obvious, so it can be corrected.
  getNumDaysFromEntries() {
    let max_day = 0;
    const entries = this.props.registration.entries;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.day > max_day) {
        max_day = entry.day;
      }
    }
    return max_day;
  }

  render() {
    // Make a separate panel for each day.
    const numDays = this.getNumDaysFromEntries();
    let dayPanels = [];
    for (let i = 1; i <= numDays; i++) {
      dayPanels.push(
        <Panel>
          <Panel.Heading>Day {i} Weigh-ins</Panel.Heading>
          <Panel.Body>Testing {i}</Panel.Body>
        </Panel>
      );
    }

    // If there are no days thus far, show a default warning panel.
    if (dayPanels.length === 0) {
      dayPanels.push(
        <Panel bsStyle="info">
          <Panel.Heading>Waiting for Registration</Panel.Heading>
          <Panel.Body>Add lifters on the Registration page before weighing them in.</Panel.Body>
        </Panel>
      );
    }

    return <div style={marginStyle}>{dayPanels}</div>;
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(WeighinsView);
