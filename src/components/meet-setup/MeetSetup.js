// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { Panel } from "react-bootstrap";

import MeetName from "./MeetName";
import MeetDate from "./MeetDate";
import MeetLength from "./MeetLength";
import PlatformCounts from "./PlatformCounts";
import InKg from "./InKg";
import FormulaSelect from "./FormulaSelect";
import FederationSelect from "./FederationSelect";
import DivisionSelect from "./DivisionSelect";
import WeightClassesSelect from "./WeightClassesSelect";
import AreWrapsRaw from "./AreWrapsRaw";

const marginStyle = { margin: "0 20px 0 20px" };

const MeetSetup = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Meet Information</Panel.Heading>
        <Panel.Body>
          <MeetName />
          <FederationSelect />
          <MeetDate />
          <MeetLength />
          <PlatformCounts />
          <InKg />
        </Panel.Body>
      </Panel>
      <Panel>
        <Panel.Heading>Rules</Panel.Heading>
        <Panel.Body>
          <DivisionSelect />
          <WeightClassesSelect sex="M" label="Men's Weight Classes (kg), omit SHW" />
          <WeightClassesSelect sex="F" label="Women's Weight Classes (kg), omit SHW" />
          <FormulaSelect />
          <AreWrapsRaw />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default MeetSetup;
