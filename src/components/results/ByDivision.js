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

// Displays the results by division.

import React from "react";
import { connect } from "react-redux";
import { Panel, Table } from "react-bootstrap";

import { getFinalResults } from "../../logic/divisionPlace";
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

import type { Category, CategoryResults } from "../../logic/divisionPlace";
import type { Entry, Sex } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  meetName: string;
  formula: string;
  areWrapsRaw: boolean;
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

class ByDivision extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: Category, key: number): any => {
    // Skip no-show entries.
    if (!entryHasLifted(entry)) return null;

    const classes = mapSexToClasses(entry.sex, this.props);
    const totalKg = getFinalEventTotalKg(entry, category.event);
    const squatKg = getBest5SquatKg(entry);
    const benchKg = getBest5BenchKg(entry);
    const deadliftKg = getBest5DeadliftKg(entry);

    // The place proceeds in order by key, except for DQ entries.
    const place = totalKg === 0 ? "DQ" : key + 1;

    // TODO: Share this code with ByPoints.
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
        break;
    }

    let pointsStr = "";
    if (totalKg !== 0 && points === 0) pointsStr = "N/A";
    if (totalKg !== 0 && points !== 0) pointsStr = points;

    return (
      <tr key={key}>
        <td>{place}</td>
        <td>{entry.name}</td>
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

  renderCategoryResults = (results: CategoryResults, key: number): any => {
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

    // If all entries were no-show, don't show this panel.
    if (rows.length === 0) {
      return null;
    }

    let eqpstr: string = category.equipment;
    if (this.props.areWrapsRaw) {
      eqpstr = "Sleeves + Wraps";
    }

    return (
      <Panel key={key}>
        <Panel.Heading>
          {sex} {category.weightClassStr} {category.weightClassStr !== "" ? "kilo" : null} {eqpstr} {category.division}{" "}
          {category.event}
        </Panel.Heading>
        <Panel.Body>
          <Table hover condensed>
            <thead>
              <tr>
                <th>Place</th>
                <th>Name</th>
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
    const results = getFinalResults(
      this.props.entries,
      this.props.weightClassesKgMen,
      this.props.weightClassesKgWomen,
      this.props.weightClassesKgMx,
      this.props.areWrapsRaw
    );

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
    areWrapsRaw: state.meet.areWrapsRaw,
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
)(ByDivision);
