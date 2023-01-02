/* eslint-disable @typescript-eslint/no-unused-vars */
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

// The parent component of the Results page, contained by the ResultsContainer.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Entry, Language } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { Dispatch } from "redux";

interface StateProps {
  global: GlobalState;
  language: Language;
}

class StreamingView extends React.Component {
  render() {
    return <React.Fragment></React.Fragment>;
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    global: state,
    language: state.language,
  };
};

export default connect(mapStateToProps)(StreamingView);
