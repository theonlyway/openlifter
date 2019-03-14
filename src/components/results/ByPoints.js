// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

// Displays the results by points.

import React from "react";
import { connect } from "react-redux";
import { Panel, Table } from "react-bootstrap";

import { getAllRankings } from "../../logic/pointsPlace";
import { getWeightClassStr } from "../../reducers/meetReducer";
import {
  getBest5SquatKg,
  getBest5BenchKg,
  getBest5DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted
} from "../../logic/entry";

import { glossbrenner } from "../../logic/coefficients/glossbrenner";
import { ipfpoints } from "../../logic/coefficients/ipf";
import { schwartzmalone } from "../../logic/coefficients/schwartzmalone";
import { wilks } from "../../logic/coefficients/wilks";

import type { PointsCategory, PointsCategoryResults } from "../../logic/pointsPlace";
import type { Entry, Formula, Sex } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  meetName: string;
  formula: Formula;
  lengthDays: number;
  weightClassesKgMen: Array<number>;
  weightClassesKgWomen: Array<number>;
  weightClassesKgMx: Array<number>;
  entries: Array<Entry>;
}

interface OwnProps {
  day: string; // Really a number, 0 meaning "all".
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
      (sex: empty) // eslint-disable-line
      return props.weightClassesKgMen;
  }
};

class ByPoints extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: PointsCategory, key: number): any => {
    // Skip no-show lifters.
    if (!entryHasLifted(entry)) return null;

    const classes = mapSexToClasses(entry.sex, this.props);
    const totalKg = getFinalEventTotalKg(entry, category.event);
    const squatKg = getBest5SquatKg(entry);
    const benchKg = getBest5BenchKg(entry);
    const deadliftKg = getBest5DeadliftKg(entry);

    // The place proceeds in order by key, except for DQ entries.
    const rank = totalKg === 0 ? "DQ" : key + 1;

    let points = 0;
    switch (this.props.formula) {
      case "Glossbrenner":
        points = glossbrenner(entry.sex, entry.bodyweightKg, totalKg).toFixed(2);
        break;
      case "Wilks":
        points = wilks(entry.sex, entry.bodyweightKg, totalKg).toFixed(2);
        break;
      case "IPF Points":
        points = ipfpoints(totalKg, entry.bodyweightKg, entry.sex, category.equipment, category.event).toFixed(2);
        break;
      case "Schwartz/Malone":
        points = schwartzmalone(entry.sex, entry.bodyweightKg, totalKg).toFixed(2);
        break;
      default:
        (this.props.formula: empty) // eslint-disable-line
        break;
    }

    let pointsStr = "";
    if (totalKg !== 0 && points === 0) pointsStr = "N/A";
    if (totalKg !== 0 && points !== 0) pointsStr = points;

    return (
      <tr key={key}>
        <td>{rank}</td>
        <td>{entry.name}</td>
        <td>{entry.sex}</td>
        <td>{entry.equipment}</td>
        <td>{entry.bodyweightKg === 0 ? null : getWeightClassStr(classes, entry.bodyweightKg)}</td>
        <td>{entry.bodyweightKg === 0 ? null : entry.bodyweightKg}</td>
        <td>{entry.age === 0 ? null : entry.age}</td>
        <td>{squatKg === 0 ? "" : squatKg}</td>
        <td>{benchKg === 0 ? "" : benchKg}</td>
        <td>{deadliftKg === 0 ? "" : deadliftKg}</td>
        <td>{totalKg === 0 ? "" : totalKg}</td>
        <td>{pointsStr}</td>
      </tr>
    );
  };

  mapSexToLabel = (sex: Sex): string => {
    switch (sex) {
      case "M":
        return "Men's";
      case "F":
        return "Women's";
      case "Mx":
        return "Mx";
      default:
        (sex: empty) // eslint-disable-line
        return "";
    }
  };

  renderCategoryResults = (results: PointsCategoryResults, key: number): any => {
    const { category, orderedEntries } = results;
    const sex = this.mapSexToLabel(category.sex);

    // Gather rows.
    let rows = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      const row = this.renderEntryRow(orderedEntries[i], category, i);
      if (row !== null) {
        rows.push(row);
      }
    }

    // If all lifters were No-Show, skip displaying this category.
    if (rows.length === 0) {
      return null;
    }

    return (
      <Panel key={key}>
        <Panel.Heading>
          {sex} {category.equipment} {category.event}
        </Panel.Heading>
        <Panel.Body>
          <Table striped hover condensed>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Sex</th>
                <th>Equipment</th>
                <th>Class</th>
                <th>Bwt</th>
                <th>Age</th>
                <th>Squat</th>
                <th>Bench</th>
                <th>Deadlift</th>
                <th>Total</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  };

  render() {
    const results = getAllRankings(this.props.entries, this.props.formula);

    let categoryPanels = [];
    for (let i = 0; i < results.length; i++) {
      const panel = this.renderCategoryResults(results[i], i);
      if (panel !== null) {
        categoryPanels.push(panel);
      }
    }

    return <div>{categoryPanels}</div>;
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  const day = Number(ownProps.day);
  let entries = state.registration.entries;
  if (day > 0) {
    entries = entries.filter(e => e.day === day);
  }

  return {
    meetName: state.meet.name,
    formula: state.meet.formula,
    lengthDays: state.meet.lengthDays,
    weightClassesKgMen: state.meet.weightClassesKgMen,
    weightClassesKgWomen: state.meet.weightClassesKgWomen,
    weightClassesKgMx: state.meet.weightClassesKgMx,
    entries: entries
  };
};

export default connect(
  mapStateToProps,
  null
)(ByPoints);
