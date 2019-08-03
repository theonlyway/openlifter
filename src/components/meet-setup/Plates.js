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

import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Table from "react-bootstrap/Table";

import ColorPicker from "./ColorPicker";

import { setPlateConfig } from "../../actions/meetSetupActions";

import { kg2lbs } from "../../logic/units";

import type { Plate } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

interface StateProps {
  inKg: boolean;
  plates: Array<Plate>;
}

interface DispatchProps {
  setPlateConfig: (number, number, string) => any;
}

type Props = StateProps & DispatchProps;

class Plates extends React.Component<Props> {
  constructor(props, context) {
    super(props, context);

    this.validateAmountInput = this.validateAmountInput.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
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

  updateHandler = (weightKg, id, amount, color) => {
    if (this.validateAmountInput(id) === "error") {
      // Although no state is set, this is used to trigger the FormGroup
      // to re-query the validationState on change.
      return this.setState({});
    }

    this.props.setPlateConfig(weightKg, Number(amount), color);
  };

  renderWeightRow = (weightKg, amount, color) => {
    // The input event value isn't passed by the event, so we assign a unique ID
    // and then just search the whole document for it.
    const id = "weight" + String(weightKg);

    // Don't use displayWeight(): the 1.25lb plates need two decimal places.
    const weight = this.props.inKg ? weightKg : kg2lbs(weightKg);

    return (
      <tr key={String(weightKg) + "_" + color}>
        <td>{weight}</td>
        <td>
          <FormGroup validationState={this.validateAmountInput(id)} style={{ marginBottom: 0 }}>
            <FormControl
              id={id}
              onChange={e => this.updateHandler(weightKg, id, e.target.value, color)}
              type="number"
              defaultValue={amount}
              min={0}
            />
          </FormGroup>
        </td>
        <td>
          <ColorPicker color={color} onChange={color => this.updateHandler(weightKg, id, amount, color)} />
        </td>
      </tr>
    );
  };

  render() {
    let plateRows = [];
    for (let i = 0; i < this.props.plates.length; i++) {
      const obj: Plate = this.props.plates[i];
      plateRows.push(this.renderWeightRow(obj.weightKg, obj.pairCount, obj.color));
    }

    const units = this.props.inKg ? "kg" : "lbs";

    return (
      <div>
        <Table striped size="sm" hover style={{ margin: "0px" }}>
          <thead>
            <tr>
              <th>Weight ({units})</th>
              <th>Pairs of Plates</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>{plateRows}</tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  inKg: state.meet.inKg,
  plates: state.meet.plates
});

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    setPlateConfig: (weightKg, amount, color) => dispatch(setPlateConfig(weightKg, amount, color))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plates);
