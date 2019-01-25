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

// Displays the selector for determining how many plates are available
// to loaders on one side.

import React from "react";
import { connect } from "react-redux";

import { FormControl, FormGroup, Table } from "react-bootstrap";

import { setPlatesOnSide } from "../../actions/meetSetupActions";

import type { PlatesOnSide } from "../../types/dataTypes";

type Props = {
  inKg: boolean,
  platesOnSide: Array<PlatesOnSide>,
  setPlatesOnSide: (number, number) => any
};

class Plates extends React.Component<Props> {
  constructor(props, context) {
    super(props, context);

    this.validateAmountInput = this.validateAmountInput.bind(this);
    this.updateAmountHandler = this.updateAmountHandler.bind(this);
  }

  validateAmountInput = id => {
    const widget: any = document.getElementById(id);

    // This can happen because the FormGroup is created before the widget exists.
    if (widget === null) return;
    const value = widget.value;

    if (value === undefined) return "error";

    // Ensure that the value is an integer in a reasonable range.
    let asNum = Number(value);
    if (Math.floor(asNum) !== asNum) return "error";
    if (asNum < 0 || asNum > 20) return "error";
    if (String(asNum) !== value) return "error";

    return null;
  };

  updateAmountHandler = (weightKg, id) => {
    if (this.validateAmountInput(id) === "error") {
      // Although no state is set, this is used to trigger the FormGroup
      // to re-query the validationState on change.
      return this.setState({});
    }

    const widget: any = document.getElementById(id);
    this.props.setPlatesOnSide(weightKg, Number(widget.value));
  };

  renderWeightRow = (weightKg, amount) => {
    // The input event value isn't passed by the event, so we assign a unique ID
    // and then just search the whole document for it.
    const id = "weight" + String(weightKg);

    const weight = this.props.inKg ? weightKg : weightKg * 2.20462262;

    return (
      <tr key={weightKg}>
        <td>{weight}</td>
        <td>
          <FormGroup validationState={this.validateAmountInput(id)} style={{ marginBottom: 0 }}>
            <FormControl
              id={id}
              onChange={e => this.updateAmountHandler(weightKg, id)}
              type="number"
              defaultValue={amount}
              min={0}
            />
          </FormGroup>
        </td>
      </tr>
    );
  };

  render() {
    let plateRows = [];
    for (let i = 0; i < this.props.platesOnSide.length; i++) {
      const obj = this.props.platesOnSide[i];
      plateRows.push(this.renderWeightRow(obj.weightKg, obj.amount));
    }

    const units = this.props.inKg ? "kg" : "lbs";

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Weight ({units})</th>
              <th># Plates on One Side</th>
            </tr>
          </thead>
          <tbody>{plateRows}</tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  inKg: state.meet.inKg,
  platesOnSide: state.meet.platesOnSide
});

const mapDispatchToProps = dispatch => {
  return {
    setPlatesOnSide: (weightKg, amount) => dispatch(setPlatesOnSide(weightKg, amount))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plates);
