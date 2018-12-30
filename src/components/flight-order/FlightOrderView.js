// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the FlightOrder page,
// contained by the FlightOrderContainer.

import React from "react";
import { Panel } from "react-bootstrap";

const marginStyle = { margin: "0 40px 0 40px" };

const FlightOrderView = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Testing</Panel.Heading>
        <Panel.Body>TODO</Panel.Body>
      </Panel>
    </div>
  );
};

export default FlightOrderView;
