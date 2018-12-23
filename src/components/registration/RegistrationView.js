// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { Panel } from "react-bootstrap";

import LifterTable from "./LifterTable";
import NewButton from "./NewButton";

const marginStyle = { margin: "0 40px 0 40px" };

class RegistrationView extends React.Component {
  render() {
    return (
      <div style={marginStyle}>
        <Panel>
          <Panel.Heading>Lifter Registration</Panel.Heading>
          <Panel.Body>
            <LifterTable />
            <NewButton />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default RegistrationView;
