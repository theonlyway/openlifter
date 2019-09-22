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

// This is the widget that gives a visual display of the weights on the bar,
// used by the loading crew.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import { displayWeight } from "../../logic/units";
import { PlateColors } from "../../constants/plateColors";

import { Lift, LoadedPlate } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

import styles from "./BarLoad.module.scss";

interface OwnProps {
  loading: Array<LoadedPlate>;
  rackInfo: string;
  inKg: boolean;
}

interface StateProps {
  lift: Lift;
}

type Props = OwnProps & StateProps;

class BarLoad extends React.Component<Props> {
  weightKgToStyle = (weightKg: number): string => {
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

  weightLbsToStyle = (weightLbs: number): string => {
    switch (weightLbs) {
      case 100:
        return styles.lbs100;
      case 55:
        return styles.lbs55;
      case 45:
        return styles.lbs45;
      case 35:
        return styles.lbs35;
      case 25:
        return styles.lbs25;
      case 10:
        return styles.lbs10;
      case 5:
        return styles.lbs5;
      case 2.5:
        return styles.lbs2p5;
      case 1.25:
        return styles.lbs1p25;
      case 0.5:
        return styles.lbs0p5;
      default:
        return styles.error;
    }
  };

  weightAnyToText = (weightAny: number): string => {
    switch (weightAny) {
      case 1.25:
        return "1¼";
      case 0.75:
        return "¾";
      case 0.5:
        return "½";
      case 0.25:
        return "¼";
      default:
        return String(weightAny);
    }
  };

  // Turns the selectPlates() array into divs.
  renderPlates = () => {
    const plates: Array<LoadedPlate> = this.props.loading;
    const inKg: boolean = this.props.inKg;

    let divs = [];
    let i = 0;

    // Iterate on a group of plates of the same weight at a time.
    while (i < plates.length) {
      const weightAny = plates[i].weightAny;

      // If the weight is negative, it's an error report.
      if (weightAny < 0) {
        divs.push(
          <div key={"error"} className={styles.error}>
            ?{displayWeight(-1 * weightAny)}
          </div>
        );
        break;
      }

      // Count how many times this same plate kind appears consecutively.
      let plateCount = 1;
      for (let j = i + 1; j < plates.length && plates[j].weightAny === weightAny; j++) {
        plateCount++;
      }

      // If that plate is large and occurs a bunch, show a counter.
      const showCounter = plateCount >= 3;

      // Push each of the plates individually.
      for (let j = 0; j < plateCount; j++) {
        const plate = plates[i + j];
        const counter = String(j + 1);

        // Light backgrounds need dark text.
        const is_light =
          plate.color === PlateColors.PLATE_DEFAULT_WHITE || plate.color === PlateColors.PLATE_DEFAULT_YELLOW;

        const style = {
          backgroundColor: plate.color,
          opacity: plate.isAlreadyLoaded ? 0.25 : undefined,
          color: is_light ? "#232323" : "#FFFFFF",
          // White plates need a border.
          border: plate.color === PlateColors.PLATE_DEFAULT_WHITE ? "1.5px solid #232323" : undefined
        };
        divs.push(
          <div
            key={weightAny + "-" + counter}
            className={inKg ? this.weightKgToStyle(weightAny) : this.weightLbsToStyle(weightAny)}
            style={style}
          >
            <div>{this.weightAnyToText(weightAny)}</div>
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
          <FormattedMessage
            id="lifting.rack-info"
            defaultMessage="Rack {rackInfo}"
            values={{
              rackInfo: this.props.rackInfo
            }}
          />
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.bar} />
        {this.renderPlates()}
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
