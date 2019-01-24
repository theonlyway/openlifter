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
