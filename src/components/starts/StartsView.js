// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Starts page, contained by the StartsContainer.

import React from "react";
import { Panel } from "react-bootstrap";

const marginStyle = { margin: "0 40px 0 40px" };

const StartsView = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Testing</Panel.Heading>
        <Panel.Body>Testing2</Panel.Body>
      </Panel>
    </div>
  );
};

export default StartsView;
