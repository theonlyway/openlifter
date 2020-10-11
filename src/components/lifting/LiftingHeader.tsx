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

// The top bar of the Lifting page, containing huge text about the current lifter.

import React from "react";
import { connect } from "react-redux";

import { Entry } from "../../types/dataTypes";
import { GlobalState, MeetState } from "../../types/stateTypes";

import Logo from "./gpc-nz-horizontal.png";

import styles from "./LiftingHeader.module.scss";

interface OwnProps {
  attemptOneIndexed: number;
  orderedEntries: Array<Entry>;
  currentEntryId: number | null;
}

interface StateProps {
  meet: MeetState;
}

type Props = OwnProps & StateProps;

class LiftingHeader extends React.Component<Props> {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.lifterName}>{this.props.meet.name}</div>
        <img className={styles.logo} src={Logo}></img>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    meet: state.meet,
  };
};

export default connect(mapStateToProps)(LiftingHeader);
