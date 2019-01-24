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

// This is the widget that gives a visual display of the weights on the bar,
// used by the loading crew.

import React from "react";
import { connect } from "react-redux";

import { updateRegistration } from "../../actions/registrationActions";

import type { Lift } from "../../reducers/liftingReducer";

import styles from "./BarLoad.module.scss";

type Props = {
  // ownProps.
  weightKg: number,
  rackInfo: string,
  entryId: ?number,

  // Redux props.
  inKg: boolean,
  barAndCollarsWeightKg: number,
  platesOnSide: Array<Object>, // TODO: Use type.
  lift: Lift,

  // Actions.
  updateRegistration: (entryId: number, obj: Object) => any
};

// Text that gets prepended to the Rack Info display.
// We need to make sure that we don't accidentally commit this text
// to the backing store if the score table edits it.
const rackInfoStart = "Rack ";

class Loading extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.handleRackInfoChange = this.handleRackInfoChange.bind(this);
  }

  // Unfortunately we update the Redux store on every change, because we can't
  // guarantee a blur event.
  handleRackInfoChange = event => {
    const entryId = this.props.entryId;
    if (entryId === null || entryId === undefined) return; // No current loading.

    let value = event.target.value;
    if (value.startsWith(rackInfoStart)) {
      value = value.replace(rackInfoStart, "");
    }

    if (this.props.lift === "S") {
      this.props.updateRegistration(entryId, { squatRackInfo: value });
    } else if (this.props.lift === "B") {
      this.props.updateRegistration(entryId, { benchRackInfo: value });
    }
  };

  weightKgToStyle = (weightKg: number): any => {
    switch (weightKg) {
      case 50:
        return styles.kg50;
      case 25:
        return styles.kg25;
      case 20:
        return styles.kg20;
      case 15:
        return styles.kg15;
      case 10:
        return styles.kg10;
      case 5:
        return styles.kg5;
      case 2.5:
        return styles.kg2p5;
      case 1.25:
        return styles.kg1p25;
      case 1:
        return styles.kg1;
      case 0.75:
        return styles.kg0p75;
      case 0.5:
        return styles.kg0p5;
      case 0.25:
        return styles.kg0p25;
      default:
        return styles.error;
    }
  };

  weightKgToText = (weightKg: number): string => {
    switch (weightKg) {
      case 1.25:
        return "1¼";
      case 0.75:
        return "¾";
      case 0.5:
        return "½";
      case 0.25:
        return "¼";
      default:
        return String(weightKg);
    }
  };

  // Selects kilo plates using the simple greedy algorithm.
  // Weight that cannot be loaded is returned at the end as a negative number.
  selectKgPlates = (): Array<number> => {
    // Handle the default case of a complete flight.
    if (this.props.weightKg === 0) {
      return [];
    }

    // Sort a copy of the plates array by descending weight.
    let sortedPlates = this.props.platesOnSide.slice().sort((a, b) => {
      return b.weightKg - a.weightKg;
    });

    let sideWeightKg = (this.props.weightKg - this.props.barAndCollarsWeightKg) / 2;
    if (sideWeightKg < 0) {
      return [sideWeightKg];
    }

    // Run through each plate, applying as many as will fit, in order.
    let plates = [];
    for (let i = 0; i < sortedPlates.length; i++) {
      let { weightKg, amount } = sortedPlates[i];

      while (amount > 0 && weightKg <= sideWeightKg) {
        amount--;
        sideWeightKg -= weightKg;
        plates.push(weightKg);
      }
    }

    // If there was an error, report it as a negative number.
    if (sideWeightKg > 0) {
      plates.push(-sideWeightKg);
    }

    return plates;
  };

  // Turns the selectKgPlates() array into divs.
  renderKgPlates = () => {
    const plates: Array<number> = this.selectKgPlates();

    let divs = [];
    let i = 0;

    // Iterate on a group of plates of the same weight at a time.
    while (i < plates.length) {
      const weightKg = plates[i];

      // If the weight is negative, it's an error report.
      if (weightKg < 0) {
        divs.push(
          <div key={"error"} className={styles.error}>
            ?{(-1 * weightKg).toFixed(1)}
          </div>
        );
        break;
      }

      // Count how many times this same plate appears consecutively.
      let plateCount = 1;
      for (let j = i + 1; j < plates.length && plates[j] === weightKg; j++) {
        plateCount++;
      }

      // If that plate is large and occurs a bunch, show a counter.
      const showCounter = plateCount >= 3;

      // Push each of the plates individually.
      for (let j = 0; j < plateCount; j++) {
        const counter = String(j + 1);
        divs.push(
          <div key={weightKg + "-" + counter} className={this.weightKgToStyle(weightKg)}>
            <div>{this.weightKgToText(weightKg)}</div>
            {showCounter ? <div>{counter}</div> : null}
          </div>
        );
      }

      i += plateCount;
    }

    return divs;
  };

  render() {
    // Only show rack info for lifts that use a rack.
    let rackInfo = null;
    if (this.props.lift !== "D") {
      // The "key" prop is necessary for React to decide to actually update it.
      // onChange is used instead of onBlur because clicking "Good Lift" doesn't
      // cause a blur event.
      rackInfo = (
        <input
          key={this.props.entryId}
          type="text"
          onChange={this.handleRackInfoChange}
          className={styles.rackInfo}
          defaultValue={rackInfoStart + this.props.rackInfo}
        />
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.bar} />
        {this.renderKgPlates()}
        <div className={styles.collar} />
        <div className={styles.bar} />
        {rackInfo}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    inKg: state.meet.inKg,
    barAndCollarsWeightKg: state.meet.barAndCollarsWeightKg,
    platesOnSide: state.meet.platesOnSide,
    lift: state.lifting.lift
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
