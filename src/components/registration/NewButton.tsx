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
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";

import { newRegistration } from "../../actions/registrationActions";

import { Entry } from "../../types/dataTypes";
import { Dispatch } from "redux";

interface DispatchProps {
  newRegistration: (obj: Partial<Entry>) => void;
}

type Props = DispatchProps;

class NewButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.props.newRegistration({});
  };

  render() {
    return (
      <Button onClick={this.handleClick} variant="primary" size="lg" block>
        <FormattedMessage id="registration.button-new-lifter" defaultMessage="New Lifter" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    newRegistration: (obj: Partial<Entry>) => dispatch(newRegistration(obj)),
  };
};

export default connect(null, mapDispatchToProps)(NewButton);
