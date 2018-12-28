// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup, FormControl } from "react-bootstrap";

import { setPlatformsOnDays } from "../../actions/meetSetupActions";

class PlatformCount extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.setPlatformsOnDays({ day: this.props.day, count: event.target.value });
  }
  render() {
    const { day } = this.props;
    const label = "Platforms on Day " + day;
    const countForDay = this.props.platformsOnDays[day - 1];
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <div>
          <FormControl type="number" placeholder={label} defaultValue={countForDay} onChange={this.handleChange} />
        </div>
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  platformsOnDays: state.meet.platformsOnDays
});

const mapDispatchToProps = dispatch => {
  return {
    setPlatformsOnDays: data => dispatch(setPlatformsOnDays(data))
  };
};

PlatformCount.propTypes = {
  platformsOnDays: PropTypes.array.isRequired,
  setPlatformsOnDays: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlatformCount);
