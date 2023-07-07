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

// Displays the selector for determining how many plates are available
// to loaders on one side.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Table from "react-bootstrap/Table";

import { setPlateConfig } from "../../actions/meetSetupActions";

import { getString } from "../../logic/strings";
import { displayWeight, kg2lbs } from "../../logic/units";

import { Language, Plate } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import { isString, isNumeric } from "../../types/utils";
import PlateInput from "./PlateInput";

interface StateProps {
  inKg: boolean;
  plates: ReadonlyArray<Plate>;
  language: Language;
}

interface DispatchProps {
  setPlateConfig: (weight: number, amount: number, color: string) => void;
}

type Props = StateProps & DispatchProps;

class Plates extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.validateAmountInput = this.validateAmountInput.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
  }

  validateAmountInput: (id: string) => "error" | null | undefined = (id) => {
    const widget: any = document.getElementById(id);

    // This can happen because the FormGroup is created before the widget exists.
    if (widget === null) return;
    const value = widget.value;

    if (value === undefined) return "error";

    // Ensure that the value is an integer in a reasonable range.
    const asNum = Number(value);
    if (Math.floor(asNum) !== asNum) return "error";
    if (asNum < 0 || asNum > 20) return "error";
    if (String(asNum) !== value) return "error";

    return null;
  };

  updateHandler = (weightKg: number, id: string, amount: string | number | string[] | undefined, color: string) => {
    if (!isString(amount) && !isNumeric(amount)) {
      throw new Error(`Expected either a string or a number, but got ${amount}`);
    }

    if (this.validateAmountInput(id) === "error") {
      // Although no state is set, this is used to trigger the FormGroup
      // to re-query the validationState on change.
      return this.setState({});
    }

    this.props.setPlateConfig(weightKg, Number(amount), color);
  };

  renderWeightRow = (weightKg: number, amount: number, color: string) => {
    // The input event value isn't passed by the event, so we assign a unique ID
    // and then just search the whole document for it.
    const id = "weight" + String(weightKg);
    const weight = this.props.inKg ? weightKg : kg2lbs(weightKg);

    return (
      <PlateInput
        id={id}
        key={id}
        weightKg={weightKg}
        displayWeight={displayWeight(weight, this.props.language)}
        pairCount={amount}
        color={color}
        onChange={this.updateHandler}
      />
    );
  };

  render() {
    const plateRows = this.props.plates.map((obj: Plate) =>
      this.renderWeightRow(obj.weightKg, obj.pairCount, obj.color),
    );
    const unitId = this.props.inKg ? "meet-setup.plates-kg" : "meet-setup.plates-lbs";
    const stringPlate = getString(unitId, this.props.language);

    return (
      <div>
        <Table striped size="sm" hover style={{ margin: "0px" }}>
          <thead>
            <tr>
              <th>{stringPlate}</th>
              <th>
                <FormattedMessage id="meet-setup.plates-num-pairs" defaultMessage="Pairs of Plates" />
              </th>
              <th>
                <FormattedMessage id="meet-setup.plates-color" defaultMessage="Color" />
              </th>
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
  plates: state.meet.plates,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setPlateConfig: (weightKg, amount, color) => dispatch(setPlateConfig(weightKg, amount, color)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Plates);
