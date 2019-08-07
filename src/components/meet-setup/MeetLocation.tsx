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

// Defines the Meet Location.
// Country, State/Province, City/Town

import React, { FormEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { updateMeet } from "../../actions/meetSetupActions";

import { GlobalState, MeetState } from "../../types/stateTypes";
import { FormControlTypeHack, assertString, isString } from "../../types/utils";

interface StateProps {
  country: string;
  state: string;
  city: string;
}

interface DispatchProps {
  updateMeet: (changes: Partial<MeetState>) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  country: string;
  state: string;
  city: string;
}

class MeetLocation extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      country: this.props.country,
      state: this.props.state,
      city: this.props.city
    };
  }

  getValidationState = (value?: string): string | null => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  handleChange = (key: keyof InternalState, event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (assertString(value)) {
      let obj: Partial<InternalState> = {};
      obj[key] = value;

      // TODO: Could not figure out how to type this properly, so falling back to any
      this.setState(obj as any);
    }
  };

  // When the control loses focus, possibly update the Redux store.
  handleBlur = (key: keyof InternalState, event: React.FocusEvent<HTMLInputElement>) => {
    const targetValue = event.currentTarget.value;
    if (!isString(targetValue) && targetValue !== undefined) {
      throw new Error(`Expected either a string or undefined, but gor "${targetValue}"`);
    }

    if (this.getValidationState(targetValue) !== "success") {
      return;
    }

    switch (key) {
      case "country":
        this.props.updateMeet({ country: targetValue });
        break;
      case "state":
        this.props.updateMeet({ state: targetValue });
        break;
      case "city":
        this.props.updateMeet({ city: targetValue });
        break;
      default:
        return;
    }
  };

  render() {
    return (
      <div>
        {/* TODO: Validation state styling */}
        <FormGroup>
          <Form.Label>Country</Form.Label>
          <FormControl
            type="text"
            placeholder="Country"
            value={this.state.country}
            onChange={(event: FormEvent<FormControlTypeHack>) => this.handleChange("country", event)}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => this.handleBlur("country", event)}
          />
        </FormGroup>
        {/* TODO: Validation state styling */}
        <FormGroup>
          <Form.Label>State/Province</Form.Label>
          <FormControl
            type="text"
            placeholder="State/Province"
            value={this.state.state}
            onChange={(event: FormEvent<FormControlTypeHack>) => this.handleChange("state", event)}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => this.handleBlur("state", event)}
          />
        </FormGroup>
        {/* TODO: Validation state styling */}
        <FormGroup>
          <Form.Label>City/Town</Form.Label>
          <FormControl
            type="text"
            placeholder="City/Town"
            value={this.state.city}
            onChange={(event: FormEvent<FormControlTypeHack>) => this.handleChange("city", event)}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => this.handleBlur("city", event)}
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

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    updateMeet: changes => dispatch(updateMeet(changes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetLocation);
