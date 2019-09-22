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

import Table from "react-bootstrap/Table";

import { getString } from "../../logic/strings";

import { Entry, Language } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

interface OwnProps {
  entries: Array<Entry>;
  rowRenderer: any;
  inLiftingPage?: boolean;
}

interface StateProps {
  inKg: boolean;
  language: Language;
}

type Props = OwnProps & StateProps;

class LifterTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  renderRows = () => {
    const LifterRow = this.props.rowRenderer;
    const { entries } = this.props;
    const inLiftingPage = this.props.inLiftingPage === true;

    return entries.map(entry => <LifterRow key={entry.id} id={entry.id} inLiftingPage={inLiftingPage} />);
  };

  renderHeader = () => {
    // Styling for small, single-character selector columns.
    const shortStyle = { width: "85px" };

    const units = this.props.inKg ? "Kg" : "Lbs";

    return (
      <tr>
        <th style={shortStyle}>Platform</th>
        <th style={shortStyle}>Flight</th>
        <th>Name</th>

        <th style={shortStyle}>{getString("common.age", this.props.language)}</th>
        <th style={shortStyle}>Bodyweight {units}</th>
        <th style={shortStyle}>Squat Rack</th>
        <th style={shortStyle}>Squat Opener {units}</th>
        <th style={shortStyle}>Bench Rack</th>
        <th style={shortStyle}>Bench Opener {units}</th>
        <th style={shortStyle}>Deadlift Opener {units}</th>
      </tr>
    );
  };

  render() {
    return (
      <Table hover size="sm" style={{ margin: "0px" }}>
        <thead>{this.renderHeader()}</thead>
        <tbody>{this.renderRows()}</tbody>
      </Table>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  language: state.language
});

export default connect(
  mapStateToProps,
  null
)(LifterTable);
