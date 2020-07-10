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

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import { setPlatformsOnDays } from "../../actions/meetSetupActions";

import { GlobalState } from "../../types/stateTypes";
import { Validation } from "../../types/dataTypes";
import { Dispatch } from "redux";
import NumberInput from "../common/NumberInput";

interface OwnProps {
  day: number;
}

interface StateProps {
  platformsOnDays: ReadonlyArray<number>;
}

interface DispatchProps {
  setPlatformsOnDays: (day: number, count: number) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  initialValue: number;
}

class PlatformCount extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      initialValue: this.props.platformsOnDays[this.props.day - 1],
    };
  }

  validate = (n: number): Validation => {
    if (!Number.isInteger(n) || n <= 0 || n > 20) {
      return "error";
    }
    return "success";
  };

  handleChange = (n: number): void => {
    if (this.validate(n) === "success") {
      this.props.setPlatformsOnDays(this.props.day, n);
    }
  };

  render() {
    return (
      <NumberInput
        initialValue={this.state.initialValue}
        step={1}
        validate={this.validate}
        onChange={this.handleChange}
        label={
          <FormattedMessage
            id="meet-setup.platforms-on-day"
            defaultMessage="Platforms on Day {number}"
            values={{
              number: this.props.day,
            }}
          />
        }
      />
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  platformsOnDays: state.meet.platformsOnDays,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setPlatformsOnDays: (day, count) => dispatch(setPlatformsOnDays(day, count)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformCount);
