// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Shows all the lifters who are competing in the same Category.

import React from "react";
import { connect } from "react-redux";

import { Panel } from "react-bootstrap";

import type { CategoryResults } from "../../common/divisionPlace";

type Props = {
  platform: number,
  categoryResults: CategoryResults
};

class OneCategory extends React.Component<Props> {
  render() {
    const category = this.props.categoryResults.category;
    const entries = this.props.categoryResults.orderedEntries;

    const sex = category.sex === "M" ? "Men's" : "Women's";

    let namelist = [];
    for (let i = 0; i < entries.length; i++) {
      namelist.push(entries[i].name);
    }

    return (
      <Panel bsStyle="info">
        <Panel.Heading>
          Platform {this.props.platform} Lifters in {sex} {category.weightClassStr}kg {category.equipment}{" "}
          {category.division} {category.event}
        </Panel.Heading>
        <Panel.Body>{namelist.join(", ")}</Panel.Body>
      </Panel>
    );
  }
}

export default connect(
  null,
  null
)(OneCategory);
