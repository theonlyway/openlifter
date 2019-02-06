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

import React from "react";
import { connect } from "react-redux";

import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import { updateMeet } from "../../actions/meetSetupActions";

import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  areWrapsRaw: boolean;
}

interface DispatchProps {
  setAreWrapsRaw: (item: Object) => void;
}

type Props = StateProps & DispatchProps;

class AreWrapsRaw extends React.Component<Props> {
  render() {
    return (
      <FormGroup>
        <ControlLabel>Should Raw and Wraps be combined for placing?</ControlLabel>
        <FormControl componentClass="select" defaultValue={this.props.areWrapsRaw} onChange={this.props.setAreWrapsRaw}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </FormControl>
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  areWrapsRaw: state.meet.areWrapsRaw
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setAreWrapsRaw: event => dispatch(updateMeet({ areWrapsRaw: event.target.value }))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AreWrapsRaw);
