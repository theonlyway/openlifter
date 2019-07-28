// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { connect } from "react-redux";

import LifterTable from "./LifterTable";
import LifterRow from "./LifterRow";
import NewButton from "./NewButton";

import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  global: GlobalState;
}

type Props = StateProps;

const marginStyle = { margin: "0 20px 20px 20px" };

class RegistrationView extends React.Component<Props> {
  render() {
    return (
      <div style={marginStyle}>
        <LifterTable entries={this.props.global.registration.entries} rowRenderer={LifterRow} />
        <NewButton />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  global: state
});

export default connect(
  mapStateToProps,
  null
)(RegistrationView);
