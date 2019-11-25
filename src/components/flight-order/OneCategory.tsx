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

// Shows all the lifters who are competing in the same Category.

import React from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";

import { CategoryResults } from "../../logic/divisionPlace";
import { Sex } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";

const sexToLabel = (sex: Sex): string => {
  switch (sex) {
    case "M":
      return "Men's";
    case "F":
      return "Women's";
    case "Mx":
      return "Mx";
    default:
      checkExhausted(sex);
      return "";
  }
};

type Props = {
  platform: number;
  categoryResults: CategoryResults;
};

class OneCategory extends React.Component<Props> {
  render() {
    const category = this.props.categoryResults.category;
    const entries = this.props.categoryResults.orderedEntries;

    const sex = sexToLabel(category.sex);

    const namelist = [];
    for (let i = 0; i < entries.length; i++) {
      namelist.push(entries[i].name);
    }

    return (
      <Card>
        <Card.Header>
          Platform {this.props.platform} Lifters in {sex} {category.weightClassStr}kg {category.equipment}{" "}
          {category.division} {category.event}
        </Card.Header>
        <Card.Body>{namelist.join(", ")}</Card.Body>
      </Card>
    );
  }
}

export default connect(null, null)(OneCategory);
