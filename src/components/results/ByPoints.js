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
import { getWeightClassStr, getWeightClassLbsStr } from "../../reducers/meetReducer";
import {
  getBest5SquatKg,
  getBest5BenchKg,
  getBest5DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted
} from "../../logic/entry";
import { kg2lbs, displayWeight } from "../../logic/units";

import { bodyweight_multiple } from "../../logic/coefficients/bodyweight-multiple";
import { dots } from "../../logic/coefficients/dots";
import { glossbrenner } from "../../logic/coefficients/glossbrenner";
import { ipfpoints } from "../../logic/coefficients/ipf";
import { nasapoints } from "../../logic/coefficients/nasa";
import { schwartzmalone } from "../../logic/coefficients/schwartzmalone";
import { wilks } from "../../logic/coefficients/wilks";

import { fosterMcCulloch } from "../../logic/coefficients/foster-mcculloch";

import type { PointsCategory, PointsCategoryResults } from "../../logic/pointsPlace";
import type { AgeCoefficients, Entry, Formula, Sex } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  inKg: boolean;
  meetName: string;
  formula: Formula;
  combineSleevesAndWraps: boolean;
  lengthDays: number;
  weightClassesKgMen: Array<number>;
  weightClassesKgWomen: Array<number>;
  weightClassesKgMx: Array<number>;
  entries: Array<Entry>;
}

// Overloads this component so it can render different types of "Best Lifter" categories.
export type AgePointsCategory = "BestLifter" | "BestMastersLifter" | "BestJuniorsLifter";

interface OwnProps {
  day: string; // Really a number, 0 meaning "all".
  ageCoefficients: AgeCoefficients; // In OwnProps so that caller can disable it.
  agePointsCategory: AgePointsCategory;
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

    // Determine age coefficients. The parent component determines their use.
    let c = 1.0;
    switch (this.props.ageCoefficients) {
      case "None":
        break;
      case "FosterMcCulloch":
        c = fosterMcCulloch(entry.age);
        break;
      default:
        break;
    }

    let points = 0;
    switch (this.props.formula) {
      case "Bodyweight Multiple":
        points = (c * bodyweight_multiple(entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      case "Dots":
        points = (c * dots(entry.sex, entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      case "Glossbrenner":
        points = (c * glossbrenner(entry.sex, entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      case "Wilks":
        points = (c * wilks(entry.sex, entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      case "IPF Points":
        points = (c * ipfpoints(totalKg, entry.bodyweightKg, entry.sex, category.equipment, category.event)).toFixed(2);
        break;
      case "Schwartz/Malone":
        points = (c * schwartzmalone(entry.sex, entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      case "NASA Points":
        points = (c * nasapoints(entry.bodyweightKg, totalKg)).toFixed(2);
        break;
      default:
        (this.props.formula: empty) // eslint-disable-line
        break;
    }

    let pointsStr = "";
    if (totalKg !== 0 && points === 0) pointsStr = "N/A";
    if (totalKg !== 0 && points !== 0) pointsStr = points;

    const inKg = this.props.inKg;

    let wtcls = inKg
      ? getWeightClassStr(classes, entry.bodyweightKg)
      : getWeightClassLbsStr(classes, entry.bodyweightKg);
    let bw = inKg ? entry.bodyweightKg : kg2lbs(entry.bodyweightKg);
    let squat = inKg ? squatKg : kg2lbs(squatKg);
    let bench = inKg ? benchKg : kg2lbs(benchKg);
    let deadlift = inKg ? deadliftKg : kg2lbs(deadliftKg);
    let total = inKg ? totalKg : kg2lbs(totalKg);

    return (
      <tr key={key}>
        <td>{rank}</td>
        <td>{entry.name}</td>
        <td>{entry.sex}</td>
        <td>{entry.equipment}</td>
        <td>{entry.bodyweightKg === 0 ? null : wtcls}</td>
        <td>{entry.bodyweightKg === 0 ? null : displayWeight(bw)}</td>
        <td>{entry.age === 0 ? null : entry.age}</td>
        <td>{squatKg === 0 ? "" : displayWeight(squat)}</td>
        <td>{benchKg === 0 ? "" : displayWeight(bench)}</td>
        <td>{deadliftKg === 0 ? "" : displayWeight(deadlift)}</td>
        <td>{totalKg === 0 ? "" : displayWeight(total)}</td>
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

    let eqpstr: string = category.equipment;
    if (this.props.combineSleevesAndWraps) {
      eqpstr = "Sleeves + Wraps";
    }

    return (
      <Panel key={key}>
        <Panel.Heading>
          {sex} {eqpstr} {category.event}
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
                <th>{this.props.ageCoefficients === "None" ? "Points" : "Age-Points"}</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  };

  render() {
    let entries = this.props.entries;

    // If this is for Best Masters lifter, just include non-standard-aged lifters.
    if (this.props.agePointsCategory !== "BestLifter") {
      entries = entries.filter(e => {
        // Filter out based on age.
        switch (this.props.agePointsCategory) {
          case "BestLifter":
            break;
          case "BestMastersLifter":
            // The coefficients logic below will handle older lifters
            // according to the chosen age coefficient system.
            if (e.age <= 27) {
              return false;
            }
            break;
          case "BestJuniorsLifter":
            // The coefficients logic below will handle older lifters
            // according to the chosen age coefficient system.
            if (e.age >= 27) {
              return false;
            }
            break;
          default:
            (this.props.agePointsCategory: empty) // eslint-disable-line
            break;
        }

        // Only include lifters who get an age bump.
        switch (this.props.ageCoefficients) {
          case "None":
            return true;
          case "FosterMcCulloch":
            return fosterMcCulloch(e.age) !== 1.0;
          default:
            (this.props.ageCoefficients: empty) // eslint-disable-line
            return true;
        }
      });
    }

    const results = getAllRankings(
      entries,
      this.props.formula,
      this.props.ageCoefficients,
      this.props.combineSleevesAndWraps
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
    inKg: state.meet.inKg,
    meetName: state.meet.name,
    formula: state.meet.formula,
    combineSleevesAndWraps: state.meet.combineSleevesAndWraps,
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
