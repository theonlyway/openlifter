// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Results page,
// contained by the ResultsContainer.

import React from "react";
import { Panel } from "react-bootstrap";

const marginStyle = { margin: "0 20px 0 20px" };

const ResultsView = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Testing</Panel.Heading>
        <Panel.Body>TODO Results</Panel.Body>
      </Panel>
    </div>
  );
};

export default ResultsView;
