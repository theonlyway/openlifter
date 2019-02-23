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

import { displayWeight } from "../../logic/units";

import type { Lift, LoadedPlate } from "../../types/dataTypes";
import type { GlobalState } from "../../types/stateTypes";

import styles from "./BarLoad.module.scss";

interface OwnProps {
  loading: Array<LoadedPlate>;
  rackInfo: string;
}

interface StateProps {
  lift: Lift;
}

type Props = OwnProps & StateProps;

class BarLoad extends React.Component<Props> {
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

  // Turns the selectPlatesKg() array into divs.
  renderKgPlates = () => {
    const plates: Array<LoadedPlate> = this.props.loading;

    let divs = [];
    let i = 0;

    // Iterate on a group of plates of the same weight at a time.
    while (i < plates.length) {
      const weightKg = plates[i].weightAny;

      // If the weight is negative, it's an error report.
      if (weightKg < 0) {
        divs.push(
          <div key={"error"} className={styles.error}>
            ?{displayWeight(-1 * weightKg)}
          </div>
        );
        break;
      }

      // Count how many times this same plate kind appears consecutively.
      let plateCount = 1;
      for (let j = i + 1; j < plates.length && plates[j].weightAny === weightKg; j++) {
        plateCount++;
      }

      // If that plate is large and occurs a bunch, show a counter.
      const showCounter = plateCount >= 3;

      // Push each of the plates individually.
      for (let j = 0; j < plateCount; j++) {
        const plate = plates[i + j];
        const counter = String(j + 1);
        divs.push(
          <div
            key={weightKg + "-" + counter}
            className={this.weightKgToStyle(weightKg)}
            style={plate.isAlreadyLoaded ? { opacity: 0.25 } : {}}
          >
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
      rackInfo = (
        <div key={this.props.rackInfo} className={styles.rackInfo}>
          Rack {this.props.rackInfo}
        </div>
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

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    lift: state.lifting.lift
  };
};

export default connect(
  mapStateToProps,
  null
)(BarLoad);
