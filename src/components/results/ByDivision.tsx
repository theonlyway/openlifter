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

// Displays the results by division.

import React from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import { getFinalResults } from "../../logic/divisionPlace";
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

import { Category, CategoryResults } from "../../logic/divisionPlace";
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

class ByDivision extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: Category, key: number): JSX.Element | null => {
    // Skip no-show entries.
    if (!entryHasLifted(entry)) return null;

    // Skip DQ'd lifters. Meet directors have reported that it's embarrassing
    // to the DQ'd lifter to have that projected.
    const totalKg = getFinalEventTotalKg(entry, category.event);
    if (totalKg === 0) return null;

    const inKg = this.props.inKg;
    const language = this.props.language;

    // The place proceeds in order by key, except for DQ entries.
    const place = totalKg === 0 ? getString("results.lifter-disqualified", language) : key + 1;

    const points: number = getPoints(this.props.formula, entry, category.event, totalKg, inKg);

    let pointsStr = "";
    if (totalKg !== 0 && points === 0) {
      pointsStr = getString("results.value-not-applicable", language);
    } else if (totalKg !== 0 && points !== 0) {
      pointsStr = displayPoints(points, language);
    }

    const classes = mapSexToClasses(entry.sex, this.props);
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

    let weightTemplate = "";
    if (inKg) {
      if (this.props.showAlternateUnits === true) {
        weightTemplate = getString("lifting.current-weight-kg-lbs", language);
      } else {
        weightTemplate = getString("lifting.current-weight-kg", language);
      }
    } else {
      if (this.props.showAlternateUnits === true) {
        weightTemplate = getString("lifting.current-weight-lbs-kg", language);
      } else {
        weightTemplate = getString("lifting.current-weight-lbs", language);
      }
    }

    let weightString: null | string = null;
    if (totalKg > 0) {
      weightString = weightTemplate
        .replace("{kg}", displayWeight(totalKg, language))
        .replace("{lbs}", displayWeight(kg2lbs(totalKg), language));
    }

    return (
      <tr key={key}>
        <td>{place}</td>
        <td>{entry.name}</td>
        <td>{entry.bodyweightKg === 0 ? null : wtcls}</td>
        <td>{entry.bodyweightKg === 0 ? null : displayWeight(bw, language)}</td>
        <td>{entry.age === 0 ? null : entry.age}</td>
        <td>{squatKg === 0 ? "" : displayWeight(squat, language)}</td>
        <td>{benchKg === 0 ? "" : displayWeight(bench, language)}</td>
        <td>{deadliftKg === 0 ? "" : displayWeight(deadlift, language)}</td>
        <td>{weightString}</td>
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

  renderCategoryResults = (results: CategoryResults, key: number): JSX.Element | null => {
    const { category, orderedEntries } = results;
    const language = this.props.language;
    const sex: string = this.mapSexToLabel(category.sex, language);

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

    let eqpstr: string = localizeEquipment(category.equipment, language);
    if (this.props.combineSleevesAndWraps) {
      eqpstr = getString("results.combined-sleeves-wraps", language);
    }

    let units = this.props.inKg
      ? getString("results.spoken-unit-kilo", language)
      : getString("results.spoken-unit-pound", language);

    // Convert the category.weightClassStr to pounds.
    let wtcls = localizeWeightClassStr(category.weightClassStr, language);
    if (category.weightClassStr !== "" && !this.props.inKg) {
      wtcls = wtclsStrKg2Lbs(category.weightClassStr);
    }

    const template = getString("results.division-template", language);
    const division = template
      .replace("{sex}", sex)
      .replace("{weightClass}", wtcls)
      .replace("{spokenUnits}", category.weightClassStr !== "" ? units : "")
      .replace("{equipment}", eqpstr)
      .replace("{division}", category.division)
      .replace("{event}", localizeEvent(category.event, language));

    return (
      <Card key={key}>
        <Card.Header>{division}</Card.Header>
        <Card.Body>
          <Table hover size="sm">
            <thead>
              <tr>
                <th>{getString("lifting.column-place", language)}</th>
                <th>{getString("lifting.column-lifter", language)}</th>
                <th>{getString("lifting.column-weightclass", language)}</th>
                <th>{getString("lifting.column-bodyweight", language)}</th>
                <th>{getString("lifting.column-age", language)}</th>
                <th>{getString("flight-order.squat-column-header", language)}</th>
                <th>{getString("flight-order.bench-column-header", language)}</th>
                <th>{getString("flight-order.deadlift-column-header", language)}</th>
                <th>{getString("lifting.column-finaltotal", language)}</th>
                <th>{getString("lifting.column-finalpoints", language)}</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  render() {
    const results = getFinalResults(
      this.props.entries,
      this.props.weightClassesKgMen,
      this.props.weightClassesKgWomen,
      this.props.weightClassesKgMx,
      this.props.combineSleevesAndWraps
    );

    let categoryCards = [];
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
)(ByDivision);
