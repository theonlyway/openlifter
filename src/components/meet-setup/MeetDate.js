// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the MeetDate date picker

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
