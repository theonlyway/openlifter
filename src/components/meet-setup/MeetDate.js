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

// Defines the MeetDate date picker.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import { ControlLabel, FormGroup } from "react-bootstrap";

import { setMeetDate } from "../../actions/meetSetupActions";

class MeetDate extends React.Component {
  render() {
    const { date } = this.props.meet;
    // Create the initial Date object for the DatePicker from the string date in the redux store
    const initialDateForPicker = new Date(date);
    return (
      <FormGroup>
        <ControlLabel>Start Date</ControlLabel>
        <div>
          <DatePicker selected={initialDateForPicker} onChange={this.props.setMeetDate} />
        </div>
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setMeetDate: date => dispatch(setMeetDate(date))
  };
};

MeetDate.propTypes = {
  meet: PropTypes.shape({
    date: PropTypes.string.isRequired
  }).isRequired,
  setMeetDate: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetDate);
