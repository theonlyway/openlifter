// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { FormControl, Panel } from "react-bootstrap";

const marginStyle = { margin: "0 40px 0 40px" };

const MeetSetup = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Body>
          <FormControl type="text" placeholder="Meet Name" />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default MeetSetup;
