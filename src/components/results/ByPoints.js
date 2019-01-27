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
import { getBest5SquatKg, getBest5BenchKg, getBest5DeadliftKg, getFinalEventTotalKg } from "../../logic/entry";

import { glossbrenner } from "../../logic/coefficients/glossbrenner";
import { wilks } from "../../logic/coefficients/wilks";
import { ipfpoints } from "../../logic/coefficients/ipf";

import type { PointsCategory, PointsCategoryResults } from "../../logic/pointsPlace";
import type { Entry } from "../../types/dataTypes";

type Props = {
  meetName: string,
  formula: string,
  lengthDays: number,
  weightClassesKgMen: Array<number>,
  weightClassesKgWomen: Array<number>,
  entries: Array<Entry>
};

class ByPoints extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: PointsCategory, key: number): any => {
    const classes = entry.sex === "M" ? this.props.weightClassesKgMen : this.props.weightClassesKgWomen;
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
      default:
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
        <td>{getWeightClassStr(classes, entry.bodyweightKg)}</td>
        <td>{entry.bodyweightKg}</td>
        <td>{entry.age}</td>
        <td>{squatKg === 0 ? "" : squatKg}</td>
        <td>{benchKg === 0 ? "" : benchKg}</td>
        <td>{deadliftKg === 0 ? "" : deadliftKg}</td>
        <td>{totalKg === 0 ? "" : totalKg}</td>
        <td>{pointsStr}</td>
      </tr>
    );
  };

  renderCategoryResults = (results: PointsCategoryResults, key: number): any => {
    const { category, orderedEntries } = results;
    const sex = category.sex === "M" ? "Men's" : "Women's";

    // Gather rows.
    let rows = [];
    for (let i = 0; i < orderedEntries.length; i++) {
      rows.push(this.renderEntryRow(orderedEntries[i], category, i));
    }

    return (
      <Panel key={key}>
        <Panel.Heading>
          {sex} {category.equipment} {category.event}
        </Panel.Heading>
        <Panel.Body>
          <Table>
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
    const results = getAllRankings(this.props.entries, "Wilks");

    let categoryPanels = [];
    for (let i = 0; i < results.length; i++) {
      categoryPanels.push(this.renderCategoryResults(results[i], i));
    }

    return <div>{categoryPanels}</div>;
  }
}

const mapStateToProps = state => {
  return {
    meetName: state.meet.name,
    formula: state.meet.formula,
    lengthDays: state.meet.lengthDays,
    weightClassesKgMen: state.meet.weightClassesKgMen,
    weightClassesKgWomen: state.meet.weightClassesKgWomen,
    entries: state.registration.entries
  };
};

export default connect(
  mapStateToProps,
  null
)(ByPoints);
