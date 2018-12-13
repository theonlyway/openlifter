// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Lifting page, contained by the LiftingContainer.

import React from "react";
import { Panel } from "react-bootstrap";

const marginStyle = { margin: "0 40px 0 40px" };

const LiftingView = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Testing</Panel.Heading>
        <Panel.Body>Testing</Panel.Body>
      </Panel>
    </div>
  );
};

export default LiftingView;
