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
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";

import RandomizeMeetSetupButton from "./RandomizeMeetSetup";
import RandomizeRegistrationButton from "./RandomizeRegistration";
import RandomizeWeighinsButton from "./RandomizeWeighins";
import RandomizeLiftingButton from "./RandomizeLifting";

import { GlobalState } from "../../types/stateTypes";

class StateTools extends React.Component<GlobalState> {
  // The simplest possible way to implement a Reset button.
  reInitializeRedux = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Card style={{ marginBottom: "17px" }}>
          <Card.Header>
            <FormattedMessage id="debug.generator-card-header" defaultMessage="Generate Random Valid Data" />
          </Card.Header>
          <Card.Body>
            <Button style={{ marginRight: "15px" }} variant="danger" onClick={this.reInitializeRedux}>
              <FormattedMessage id="debug.button-reset" defaultMessage="Reset" />
            </Button>
            <ButtonGroup>
              <RandomizeMeetSetupButton />
              <RandomizeRegistrationButton />
              <RandomizeWeighinsButton />
              <RandomizeLiftingButton />
            </ButtonGroup>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <FormattedMessage id="debug.state-card-header" defaultMessage="Redux State" />
          </Card.Header>
          <Card.Body>
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): GlobalState => ({
  ...state,
});

export default connect(mapStateToProps)(StateTools);
