// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { Button } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import LifterTable from "./LifterTable";

const marginStyle = { margin: "0 40px 0 40px" };

const RegistrationView = () => {
  return (
    <div style={marginStyle}>
      <Panel>
        <Panel.Heading>Lifter Registration</Panel.Heading>
        <Panel.Body>
          <LifterTable/>
          <Button bsStyle="primary" bsSize="large" block>New Lifter</Button>
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default RegistrationView;
