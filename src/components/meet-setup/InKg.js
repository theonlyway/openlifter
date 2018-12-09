// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel } from "react-bootstrap";

import { setInKg } from "../../actions/meetSetupActions";

class InKg extends React.Component {
  render() {
    const { inKg } = this.props.meet;
    return (
      <div>
        <input type="checkbox" checked={inKg} onChange={this.props.setInKg} />
        <ControlLabel>Kilograms</ControlLabel>
      </div>
    );
  }
}

InKg.propTypes = {
  meet: PropTypes.shape({
    inKg: PropTypes.bool.isRequired
  }).isRequired,
  setInKg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ...state
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
