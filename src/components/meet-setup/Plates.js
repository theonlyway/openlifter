// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Displays the selector for determining how many plates are available
// to loaders on one side.

import React from "react";
import { connect } from "react-redux";

import { FormControl, FormGroup, Table } from "react-bootstrap";

import { setPlatesOnSide } from "../../actions/meetSetupActions";

type Props = {
  platesOnSide: Array<{ weightKg: number, amount: number }>, // TODO: Use type export.
  setPlatesOnSide: (number, number) => any
};

class Plates extends React.Component<Props> {
  constructor(props, context) {
    super(props, context);

    this.validateAmountInput = this.validateAmountInput.bind(this);
    this.updateAmountHandler = this.updateAmountHandler.bind(this);
  }

  validateAmountInput = id => {
    const widget = document.getElementById(id);
    console.log(id);

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

    const widget = document.getElementById(id);
    this.props.setPlatesOnSide(weightKg, Number(widget.value));
  };

  renderWeightRow = (weightKg, amount) => {
    // The input event value isn't passed by the event, so we assign a unique ID
    // and then just search the whole document for it.
    let id = "weight" + String(weightKg);

    return (
      <tr key={weightKg}>
        <td>{weightKg}</td>
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

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Weight (kg)</th>
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
