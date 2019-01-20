// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// This is the widget that gives a visual display of the weights on the bar,
// used by the loading crew.

import React from "react";
import { connect } from "react-redux";

import styles from "./BarLoad.module.scss";

type Props = {
  // ownProps.
  weightKg: number,
  rackInfo: string,

  // Redux props.
  inKg: boolean,
  barAndCollarsWeightKg: number,
  platesOnSide: Array<Object> // TODO: Use type.
};

class Loading extends React.Component<Props> {
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
  selectKgPlates = () => {
    // Sort a copy of the plates array by descending weight.
    let sortedPlates = this.props.platesOnSide.slice().sort((a, b) => {
      return b.weightKg - a.weightKg;
    });

    let sideWeightKg = (this.props.weightKg - this.props.barAndCollarsWeightKg) / 2;
    let plates = [];

    // Run through each plate, applying as many as will fit, in order.
    for (let i = 0; i < sortedPlates.length; i++) {
      let { weightKg, amount } = sortedPlates[i];

      while (amount > 0 && weightKg <= sideWeightKg) {
        amount--;
        sideWeightKg -= weightKg;

        // For larger plates that may occur many times, show a counter.
        let maybeCounter = <span />;
        if (weightKg >= 5 && sortedPlates[i].amount > 3) {
          maybeCounter = <div>{sortedPlates[i].amount - amount}</div>;
        }

        plates.push(
          <div key={weightKg + "-" + amount} className={this.weightKgToStyle(weightKg)}>
            <div>{this.weightKgToText(weightKg)}</div>
            {maybeCounter}
          </div>
        );
      }
    }

    if (sideWeightKg > 0) {
      plates.push(
        <div key={"error"} className={styles.error}>
          ?{sideWeightKg.toFixed(1)}
        </div>
      );
    }

    return plates;
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.bar} />
        {this.selectKgPlates()}
        <div className={styles.collar} />
        <div className={styles.bar} />

        <div className={styles.rackInfo}>Rack {this.props.rackInfo}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    inKg: state.meet.inKg,
    barAndCollarsWeightKg: state.meet.barAndCollarsWeightKg,
    platesOnSide: state.meet.platesOnSide
  };
};

export default connect(
  mapStateToProps,
  null
)(Loading);
