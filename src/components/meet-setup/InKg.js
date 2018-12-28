// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Checkbox } from "react-bootstrap";

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

const mapStateToProps = state => ({
  inKg: state.meet.inKg
});

const mapDispatchToProps = dispatch => {
  return {
    setInKg: event => dispatch(setInKg(event.target.checked))
  };
};

InKg.propTypes = {
  inKg: PropTypes.bool.isRequired,
  setInKg: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InKg);
