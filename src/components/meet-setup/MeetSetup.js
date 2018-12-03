// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { Panel } from "react-bootstrap";

import MeetName from "./MeetName";
import FormulaSelect from "./FormulaSelect";
import FederationSelect from "./FederationSelect";

const marginStyle = { margin: "0 40px 0 40px" };

const MeetSetup = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Meet Information</Panel.Heading>
        <Panel.Body>
          <MeetName />
        </Panel.Body>
      </Panel>
      <Panel>
        <Panel.Heading>Rules</Panel.Heading>
        <Panel.Body>
          <FederationSelect />
          <FormulaSelect />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default MeetSetup;