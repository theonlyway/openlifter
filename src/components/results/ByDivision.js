// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Displays the results by division.

import React from "react";
import { connect } from "react-redux";
import { Panel, Table } from "react-bootstrap";

import { getAllResults } from "../../common/divisionPlace";
import { getWeightClassStr } from "../../reducers/meetReducer";
import {
  getBest5SquatKg,
  getBest5BenchKg,
  getBest5DeadliftKg,
  getFinalEventTotalKg
} from "../../reducers/registrationReducer";

import { glossbrenner } from "../../common/points-glossbrenner";
import { wilks } from "../../common/points-wilks";
import { ipfpoints } from "../../common/points-ipf";

import type { Category, CategoryResults } from "../../common/divisionPlace";
import type { Entry } from "../../reducers/registrationReducer";

type Props = {
  meetName: string,
  formula: string,
  lengthDays: number,
  weightClassesKgMen: Array<number>,
  weightClassesKgWomen: Array<number>,
  entries: Array<Entry>
};

class ByDivision extends React.Component<Props> {
  renderEntryRow = (entry: Entry, category: Category, key: number): any => {
    const classes = entry.sex === "M" ? this.props.weightClassesKgMen : this.props.weightClassesKgWomen;
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

  renderCategoryResults = (results: CategoryResults, key: number): any => {
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
          {sex} {category.weightClassStr}kg {category.equipment} {category.division} {category.event}
        </Panel.Heading>
        <Panel.Body>
          <Table>
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
    const results = getAllResults(this.props.entries, this.props.weightClassesKgMen, this.props.weightClassesKgWomen);

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
)(ByDivision);
