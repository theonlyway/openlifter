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

// An editable component for age of the lifter on the weigh ins page.

import React from "react";
import { connect } from "react-redux";

import { FormControl, FormGroup } from "react-bootstrap";

import { updateRegistration } from "../../actions/registrationActions";
import type { RegistrationState } from "../../reducers/registrationReducer";

type Props = {
  id: number,
  age: number,
  updateRegistration: (number, any) => RegistrationState
};

type State = {
  value: string
};

class AgeInput extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    let ageStr = "";
    if (this.props.age !== 0) {
      ageStr = String(this.props.age);
    }

    this.state = {
      value: ageStr
    };
  }

  getValidationState() {
    const { value } = this.state;

    if (value === "") return null;

    const asNumber = Number(value);
    if (isNaN(asNumber)) return "error";
    if (asNumber <= 4) return "warning";
    if (asNumber > 100) return "warning";
    return null;
  }

  handleChange = event => {
    const value = event.target.value;
    this.setState({ value: value });
  };

  handleBlur = event => {
    if (this.getValidationState() === "error") {
      return;
    }

    const entryId = this.props.id;

    this.props.updateRegistration(entryId, { age: Number(this.state.value) });
  };

  render() {
    return (
      <FormGroup validationState={this.getValidationState()} style={{ marginBottom: 0 }}>
        <FormControl
          type="text"
          placeholder=""
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          //className={styles.ageInput}
        />
      </FormGroup>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(AgeInput);
