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

// Displays the results by team.

import React from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import { getFinalTeamResults } from "../../logic/teamPlace";
import { getWeightClassStr, getWeightClassLbsStr, wtclsStrKg2Lbs } from "../../reducers/meetReducer";
import {
  getBest5SquatKg,
  getBest5BenchKg,
  getBest5DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted
} from "../../logic/entry";
import { kg2lbs, displayWeight, displayPoints, displayNumber } from "../../logic/units";

import { getString, localizeEquipment, localizeEvent, localizeWeightClassStr } from "../../logic/strings";
import { getPoints } from "../../logic/coefficients/coefficients";

import { Category } from "../../logic/divisionPlace";
import { TeamResults } from "../../logic/teamPlace";
import { Entry, Formula, Language, Sex } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";

interface StateProps {
  inKg: boolean;
  showAlternateUnits: boolean;
  meetName: string;
  formula: Formula;
  combineSleevesAndWraps: boolean;
  lengthDays: number;
  weightClassesKgMen: Array<number>;
  weightClassesKgWomen: Array<number>;
  weightClassesKgMx: Array<number>;
  language: Language;
  entries: Array<Entry>;
}

interface OwnProps {
  day: string | number; // Really a number, 0 meaning "all".
}

type Props = StateProps & OwnProps;

const mapSexToClasses = (sex: Sex, props: Props): Array<number> => {
  switch (sex) {
    case "M":
      return props.weightClassesKgMen;
    case "F":
      return props.weightClassesKgWomen;
    case "Mx":
      return props.weightClassesKgMx;
    default:
      checkExhausted(sex);
      return props.weightClassesKgMen;
  }
};

class ByTeam extends React.Component<Props> {
  render() {
    const language = this.props.language;

    const results = getFinalTeamResults(
      this.props.entries,
      this.props.weightClassesKgMen,
      this.props.weightClassesKgWomen,
      this.props.weightClassesKgMx,
      this.props.combineSleevesAndWraps
    );

    let rows = [];
    for (let i = 0; i < results.length; ++i) {
      const teamResults = results[i];
      rows.push(
        <tr>
          <td>{teamResults.cumulativePoints > 0 ? i + 1 : ""}</td>
          <td>{teamResults.team}</td>
          <td>{teamResults.cumulativePoints}</td>
        </tr>
      );
    }

    return (
      <div>
        <Card>
          <Card.Header>Results by Team</Card.Header>
          <Card.Body>
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>{getString("lifting.column-place", language)}</th>
                  <th>Club</th>
                  <th>{getString("lifting.column-finalpoints", language)}</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  const day = Number(ownProps.day);
  let entries = state.registration.entries;
  if (day > 0) {
    entries = entries.filter(e => e.day === day);
  }

  return {
    inKg: state.meet.inKg,
    showAlternateUnits: state.meet.showAlternateUnits,
    meetName: state.meet.name,
    formula: state.meet.formula,
    combineSleevesAndWraps: state.meet.combineSleevesAndWraps,
    lengthDays: state.meet.lengthDays,
    weightClassesKgMen: state.meet.weightClassesKgMen,
    weightClassesKgWomen: state.meet.weightClassesKgWomen,
    weightClassesKgMx: state.meet.weightClassesKgMx,
    language: state.language,
    entries: entries
  };
};

export default connect(
  mapStateToProps,
  null
)(ByTeam);
