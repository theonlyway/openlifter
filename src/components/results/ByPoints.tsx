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

// Displays the results by points.

import React from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import { getAllRankings } from "../../logic/pointsPlace";
import { getWeightClassStr, getWeightClassLbsStr } from "../../reducers/meetReducer";
import {
  getBest5SquatKg,
  getBest5BenchKg,
  getBest5DeadliftKg,
  getFinalEventTotalKg,
  entryHasLifted,
} from "../../logic/entry";
import { getString, localizeEquipment, localizeEvent, localizeSex } from "../../logic/strings";
import { kg2lbs, displayNumber, displayPoints, displayWeight, displayPlaceOrdinal } from "../../logic/units";

import { getAgeAdjustedPoints } from "../../logic/coefficients/coefficients";

import { PointsCategory, PointsCategoryResults } from "../../logic/pointsPlace";
import { AgeCoefficients, Entry, Formula, Language, Sex } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";
import { fosterMcCulloch } from "../../logic/coefficients/foster-mcculloch";
import { mapSexToClasses } from "../../logic/records";

interface StateProps {
  inKg: boolean;
  meetName: string;
  meetDate: string;
  formula: Formula;
  combineSleevesAndWraps: boolean;
  lengthDays: number;
  weightClassesKgMen: ReadonlyArray<number>;
  weightClassesKgWomen: ReadonlyArray<number>;
  weightClassesKgMx: ReadonlyArray<number>;
  language: Language;
  entries: ReadonlyArray<Entry>;
}

// Overloads this component so it can render different types of "Best Lifter" categories.
export type AgePointsCategory = "BestLifter" | "BestMastersLifter" | "BestJuniorsLifter";

interface OwnProps {
  day: string | number; // Really a number, 0 meaning "all".
  ageCoefficients: AgeCoefficients; // In OwnProps so that caller can disable it.
  agePointsCategory: AgePointsCategory;
}

type Props = StateProps & OwnProps;

class ByPoints extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: PointsCategory, key: number): JSX.Element | null => {
    // Skip no-show lifters.
    if (!entryHasLifted(entry)) return null;

    // Skip DQ'd lifters. Meet directors have reported that it's embarrassing
    // to the DQ'd lifter to have that projected.
    const totalKg = getFinalEventTotalKg(entry, category.event);
    if (totalKg === 0) return null;

    const inKg = this.props.inKg;
    const language = this.props.language;

    // The place proceeds in order by key, except for guests
    const rank = entry.guest
      ? getString("results.lifter-guest", language)
      : displayPlaceOrdinal(key + 1, entry, language);

    const points: number = getAgeAdjustedPoints(
      this.props.ageCoefficients,
      this.props.meetDate,
      this.props.formula,
      entry,
      category.event,
      totalKg,
      inKg
    );

    let pointsStr = "";
    if (totalKg !== 0 && points === 0) {
      pointsStr = getString("results.value-not-applicable", language);
    } else if (totalKg !== 0 && points !== 0) {
      pointsStr = displayPoints(points, language);
    }

    const firstDivision = entry.divisions.length > 0 ? entry.divisions[0] : "";
    const numDivisions = entry.divisions.length;

    const classes = mapSexToClasses(
      entry.sex,
      this.props.weightClassesKgMen,
      this.props.weightClassesKgWomen,
      this.props.weightClassesKgMx
    );
    const wtcls = inKg
      ? getWeightClassStr(classes, entry.bodyweightKg, language)
      : getWeightClassLbsStr(classes, entry.bodyweightKg);
    const bw = inKg ? entry.bodyweightKg : kg2lbs(entry.bodyweightKg);

    const squatKg = getBest5SquatKg(entry);
    const squat = inKg ? squatKg : kg2lbs(squatKg);

    const benchKg = getBest5BenchKg(entry);
    const bench = inKg ? benchKg : kg2lbs(benchKg);

    const deadliftKg = getBest5DeadliftKg(entry);
    const deadlift = inKg ? deadliftKg : kg2lbs(deadliftKg);

    const total = inKg ? totalKg : kg2lbs(totalKg);

    return (
      <tr key={key}>
        <td>{rank}</td>
        <td>{entry.name}</td>
        <td>{localizeSex(entry.sex, language)}</td>
        <td>
          {firstDivision} {numDivisions > 1 ? "(+" + (numDivisions - 1) + ")" : ""}
        </td>
        <td>{localizeEquipment(entry.equipment, language)}</td>
        <td>{entry.bodyweightKg === 0 ? null : wtcls}</td>
        <td>{entry.bodyweightKg === 0 ? null : displayWeight(bw, language)}</td>
        <td>{entry.age === 0 ? null : displayNumber(entry.age, language)}</td>
        <td>{squatKg === 0 ? "" : displayWeight(squat, language)}</td>
        <td>{benchKg === 0 ? "" : displayWeight(bench, language)}</td>
        <td>{deadliftKg === 0 ? "" : displayWeight(deadlift, language)}</td>
        <td>{totalKg === 0 ? "" : displayWeight(total, language)}</td>
        <td>{pointsStr}</td>
      </tr>
    );
  };

  mapSexToLabel = (sex: Sex, language: Language): string => {
    switch (sex) {
      case "M":
        return getString("results.mens", language);
      case "F":
        return getString("results.womens", language);
      case "Mx":
        return getString("results.mxs", language);
      default:
        checkExhausted(sex);
        return "";
    }
  };

  renderCategoryResults = (results: PointsCategoryResults, key: number): JSX.Element | null => {
    const { category, orderedEntries } = results;
    const language = this.props.language;
    const sex: string = this.mapSexToLabel(category.sex, language);

    // Gather rows.
    const rows = [];
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

    let eqpstr: string = localizeEquipment(category.equipment, language);
    if (this.props.combineSleevesAndWraps && (category.equipment === "Sleeves" || category.equipment === "Wraps")) {
      eqpstr = getString("results.combined-sleeves-wraps", language);
    }

    const template = getString("results.category-template", language);
    const categoryString = template
      .replace("{sex}", sex)
      .replace("{equipment}", eqpstr)
      .replace("{event}", localizeEvent(category.event, language));

    return (
      <Card key={key} style={{ marginTop: "17px" }}>
        <Card.Header>{categoryString}</Card.Header>
        <Card.Body>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>{getString("results.column-rank", language)}</th>
                <th>{getString("lifting.column-lifter", language)}</th>
                <th>{getString("results.column-sex", language)}</th>
                <th>{getString("lifting.column-division", language)}</th>
                <th>{getString("results.column-equipment", language)}</th>
                <th>{getString("lifting.column-weightclass", language)}</th>
                <th>{getString("lifting.column-bodyweight", language)}</th>
                <th>{getString("lifting.column-age", language)}</th>
                <th>{getString("flight-order.squat-column-header", language)}</th>
                <th>{getString("flight-order.bench-column-header", language)}</th>
                <th>{getString("flight-order.deadlift-column-header", language)}</th>
                <th>{getString("lifting.column-finaltotal", language)}</th>
                <th>
                  {this.props.ageCoefficients === "None"
                    ? getString("lifting.column-finalpoints", language)
                    : getString("results.column-age-points", language)}
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  render() {
    let entries = this.props.entries;

    // If this is for Best Masters lifter, just include non-standard-aged lifters.
    if (this.props.agePointsCategory !== "BestLifter") {
      entries = entries.filter((e) => {
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
            checkExhausted(this.props.agePointsCategory);
            break;
        }

        // Only include lifters who get an age bump.
        switch (this.props.ageCoefficients) {
          case "None":
            return true;
          case "FosterMcCulloch":
            return fosterMcCulloch(e.age) !== 1.0;
          default:
            checkExhausted(this.props.ageCoefficients);
            return true;
        }
      });
    }

    const results = getAllRankings(
      entries,
      this.props.formula,
      this.props.ageCoefficients,
      this.props.combineSleevesAndWraps,
      this.props.inKg,
      this.props.meetDate
    );

    const categoryCards = [];
    for (let i = 0; i < results.length; i++) {
      const panel = this.renderCategoryResults(results[i], i);
      if (panel !== null) {
        categoryCards.push(panel);
      }
    }

    return <div>{categoryCards}</div>;
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  const day = Number(ownProps.day);
  let entries = state.registration.entries;
  if (day > 0) {
    entries = entries.filter((e) => e.day === day);
  }

  return {
    inKg: state.meet.inKg,
    meetName: state.meet.name,
    meetDate: state.meet.date,
    formula: state.meet.formula,
    combineSleevesAndWraps: state.meet.combineSleevesAndWraps,
    lengthDays: state.meet.lengthDays,
    weightClassesKgMen: state.meet.weightClassesKgMen,
    weightClassesKgWomen: state.meet.weightClassesKgWomen,
    weightClassesKgMx: state.meet.weightClassesKgMx,
    language: state.language,
    entries: entries,
  };
};

export default connect(mapStateToProps)(ByPoints);
