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

// Defines the Meet Location.
// Country, State/Province, City/Town

import React from "react";
import { connect } from "react-redux";

import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import { updateMeet } from "../../actions/meetSetupActions";

import type { GlobalState, MeetState } from "../../types/stateTypes";

interface StateProps {
  country: string;
  state: string;
  city: string;
}

interface DispatchProps {
  updateMeet: (changes: $Shape<MeetState>) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  country: string;
  state: string;
  city: string;
}

class MeetLocation extends React.Component<Props, InternalState> {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      country: this.props.country,
      state: this.props.state,
      city: this.props.city
    };
  }

  getValidationState = (value: string): string | null => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  handleChange = (key, event) => {
    const value = event.target.value;
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  };

  // When the control loses focus, possibly update the Redux store.
  handleBlur = (key, event) => {
    if (this.getValidationState(event.target.value) !== "success") {
      return;
    }

    switch (key) {
      case "country":
        this.props.updateMeet({ country: event.target.value });
        break;
      case "state":
        this.props.updateMeet({ state: event.target.value });
        break;
      case "city":
        this.props.updateMeet({ city: event.target.value });
        break;
      default:
        return;
    }
  };

  render() {
    return (
      <div>
        <FormGroup validationState={this.getValidationState(this.state.country)}>
          <ControlLabel>Country</ControlLabel>
          <FormControl
            type="text"
            placeholder="Country"
            value={this.state.country}
            onChange={event => this.handleChange("country", event)}
            onBlur={event => this.handleBlur("country", event)}
          />
        </FormGroup>
        <FormGroup validationState={this.getValidationState(this.state.state)}>
          <ControlLabel>State/Province</ControlLabel>
          <FormControl
            type="text"
            placeholder="State/Province"
            value={this.state.state}
            onChange={event => this.handleChange("state", event)}
            onBlur={event => this.handleBlur("state", event)}
          />
        </FormGroup>
        <FormGroup validationState={this.getValidationState(this.state.city)}>
          <ControlLabel>City/Town</ControlLabel>
          <FormControl
            type="text"
            placeholder="City/Town"
            value={this.state.city}
            onChange={event => this.handleChange("city", event)}
            onBlur={event => this.handleBlur("city", event)}
          />
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  country: state.meet.country,
  state: state.meet.state,
  city: state.meet.city
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    updateMeet: changes => dispatch(updateMeet(changes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetLocation);
