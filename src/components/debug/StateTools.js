// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Tools for manipulating state information to aid debugging.

import React from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup, Panel } from "react-bootstrap";

import RandomizeMeetSetupButton from "./RandomizeMeetSetup";
import RandomizeRegistrationButton from "./RandomizeRegistration";
import RandomizeWeighinsButton from "./RandomizeWeighins";

class StateTools extends React.Component {
  // The simplest possible way to implement a Reset button.
  reInitializeRedux = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Panel bsStyle="danger">
          <Panel.Heading>Generate Random Valid Data</Panel.Heading>
          <Panel.Body>
            <Button style={{ marginRight: "15px" }} bsStyle="danger" onClick={this.reInitializeRedux}>
              Reset
            </Button>
            <ButtonGroup>
              <RandomizeMeetSetupButton />
              <RandomizeRegistrationButton />
              <RandomizeWeighinsButton />
            </ButtonGroup>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>Redux State</Panel.Heading>
          <Panel.Body>
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(StateTools);
