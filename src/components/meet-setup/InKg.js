// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Checkbox, ControlLabel, FormGroup } from "react-bootstrap";

import { setInKg } from "../../actions/meetSetupActions";

class InKg extends React.Component {
  render() {
    return (
      <Checkbox checked={this.props.inKg} onChange={this.props.setInKg}>
        Kilograms
      </Checkbox>
    );
  }
}

InKg.propTypes = {
  inKg: PropTypes.bool.isRequired,
  setInKg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  inKg: state.meet.inKg
});

const mapDispatchToProps = dispatch => {
  return {
    setInKg: event => dispatch(setInKg(event.target.checked))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InKg);
