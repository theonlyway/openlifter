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

// The Federation selector is pre-populated with a list of known federations
// for which some degree of auto-configuration of divisions and weightclasses exists.
//
// It also supports custom entry of any federation, outside of the list provided,
// although in that case the divisions and weightclasses can't be auto-populated.

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ControlLabel, FormGroup } from "react-bootstrap";
import Creatable from "react-select/lib/Creatable";

import { setFederation } from "../../actions/meetSetupActions";

const defaultOptions = [{ value: "WRPF", label: "WRPF" }];

class FederationSelect extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The "value" property expects an object instead of a string.
    this.valueObject = defaultOptions.find(option => {
      return option.value === this.props.federation;
    });

    // If the user created a new federation, it won't be present
    // in the defaultOptions. To display it, expand the options with the prop.
    if (!this.valueObject && this.props.federation) {
      this.options = defaultOptions.concat({
        value: this.props.federation,
        label: this.props.federation
      });
      this.valueObject = this.options[this.options.length - 1];
    } else {
      this.options = defaultOptions;
    }
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Federation</ControlLabel>
        <Creatable
          defaultValue={this.valueObject}
          onChange={this.props.setFederation}
          options={this.options}
          placeholder="Type or select..."
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = state => ({
  federation: state.meet.federation
});

const mapDispatchToProps = dispatch => {
  return {
    setFederation: item => dispatch(setFederation(item.value))
  };
};

FederationSelect.propTypes = {
  federation: PropTypes.string.isRequired,
  setFederation: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FederationSelect);
