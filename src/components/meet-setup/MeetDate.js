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

// Defines the MeetDate date picker.

import React from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";

import { setMeetDate } from "../../actions/meetSetupActions";
import { iso8601ToLocalDate, localDateToIso8601 } from "../../logic/date";

import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  date: string;
}

interface DispatchProps {
  setMeetDate: (date: Date) => void;
}

type Props = StateProps & DispatchProps;

class MeetDate extends React.Component<Props> {
  render() {
    // The DatePicker manipulates a Date object in local time.
    const initialDate: Date = iso8601ToLocalDate(this.props.date);

    return (
      <FormGroup>
        <Form.Label>Start Date</Form.Label>
        <div>
          <DatePicker dateFormat="yyyy-MM-dd" selected={initialDate} onChange={this.props.setMeetDate} />
        </div>
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  date: state.meet.date
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setMeetDate: date => {
      dispatch(setMeetDate(localDateToIso8601(date)));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetDate);
