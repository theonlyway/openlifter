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
import PropTypes from "prop-types";
import PlatformCount from "./PlatformCount";

class PlatformCounts extends React.Component {
  constructor(props) {
    super(props);
    this.createPlatformInputs = this.createPlatformInputs.bind(this);
  }

  createPlatformInputs() {
    let inputs = [];
    const lengthDays = this.props.lengthDays;
    for (let i = 1; i <= lengthDays; i++) {
      inputs.push(<PlatformCount key={i} day={i} />);
    }
    return inputs;
  }
  render() {
    return <div>{this.createPlatformInputs()}</div>;
  }
}

const mapStateToProps = state => ({
  lengthDays: state.meet.lengthDays
});

PlatformCounts.propTypes = {
  lengthDays: PropTypes.number.isRequired
};

export default connect(
  mapStateToProps,
  null
)(PlatformCounts);
