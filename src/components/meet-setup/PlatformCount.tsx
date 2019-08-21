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

import React, { FormEvent } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";

import { setPlatformsOnDays } from "../../actions/meetSetupActions";

import { parseInteger } from "../../logic/parsers";

import { GlobalState } from "../../types/stateTypes";
import { Validation } from "../../types/dataTypes";
import { FormControlTypeHack } from "../../types/utils";
import { Dispatch } from "redux";

interface OwnProps {
  day: number;
}

interface StateProps {
  platformsOnDays: Array<number>;
}

interface DispatchProps {
  setPlatformsOnDays: (day: number, count: number) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  value: string;
}

class PlatformCount extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: String(this.props.platformsOnDays[this.props.day - 1])
    };
  }

  validate = (): Validation => {
    const { value } = this.state;
    const asNumber = parseInteger(value);
    if (asNumber === undefined || asNumber <= 0 || asNumber > 20) {
      return "error";
    }
    return "success";
  };

  handleChange = (event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value;
    if (typeof value === "string") {
      this.setState({ value: value }, () => {
        if (this.validate() === "success") {
          this.props.setPlatformsOnDays(this.props.day, Number(value));
        }
      });
    }
  };

  render() {
    const { day } = this.props;
    const label = "Platforms on Day " + day;
    const validation = this.validate();

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="number"
          min={1}
          max={20}
          step={1}
          value={this.state.value}
          onChange={this.handleChange}
          isValid={validation === "success"}
          isInvalid={validation === "error"}
          className={validation === "warning" ? "is-warning" : undefined}
        />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  platformsOnDays: state.meet.platformsOnDays
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setPlatformsOnDays: (day, count) => dispatch(setPlatformsOnDays(day, count))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlatformCount);
