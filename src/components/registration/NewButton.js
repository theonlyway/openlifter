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

// Defines the button that adds a new entry to the registrations table.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { newRegistration } from "../../actions/registrationActions";

class NewButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.newRegistration({});
  }

  render() {
    return (
      <Button onClick={this.handleClick} bsStyle="primary" bsSize="large" block>
        New Lifter
      </Button>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    newRegistration: obj => dispatch(newRegistration(obj))
  };
};

NewButton.propTypes = {
  newRegistration: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewButton);
