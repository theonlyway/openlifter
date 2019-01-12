// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// This is the widget that gives a visual display of the weights on the bar,
// used by the loading crew.

import React from "react";
import { connect } from "react-redux";

import styles from "./BarLoad.module.scss";

type Props = {
  weightKg: number,
  rackInfo: string
};

class Loading extends React.Component<Props> {
  // Selects kilo plates using the simple greedy algorithm.
  selectKgPlates() {
    // The combined weight of the bar and collars, the lightest valid weight.
    const barAndCollarWeightKg = 25;

    // How many of each plate is available.
    let num50 = 0;
    let num25 = 10;
    let num20 = 1;
    let num15 = 1;
    let num10 = 1;
    let num5 = 1;
    let num2p5 = 1;
    let num1p25 = 1;
    let num0p5 = 1;
    let num0p25 = 1;

    // Ascending counters for certain plates, to be helpful.
    let counter50Kg = 1;
    let counter25Kg = 1;

    let sideWeightKg = (this.props.weightKg - barAndCollarWeightKg) / 2;
    let plates = [];
    while (sideWeightKg > 0) {
      if (num50 > 0 && sideWeightKg >= 50) {
        plates.push(
          <div key={"50-" + num50} className={styles.kg50}>
            <div>50</div>
            <div>{counter50Kg}</div>
          </div>
        );
        sideWeightKg -= 50;
        counter50Kg++;
        num50--;
      } else if (num25 > 0 && sideWeightKg >= 25) {
        plates.push(
          <div key={"25-" + num25} className={styles.kg25}>
            <div>25</div>
            <div>{counter25Kg}</div>
          </div>
        );
        sideWeightKg -= 25;
        counter25Kg++;
        num25--;
      } else if (num20 > 0 && sideWeightKg >= 20) {
        plates.push(
          <div key={"20-" + num20} className={styles.kg20}>
            20
          </div>
        );
        sideWeightKg -= 20;
        num20--;
      } else if (num15 > 0 && sideWeightKg >= 15) {
        plates.push(
          <div key={"15-" + num15} className={styles.kg15}>
            15
          </div>
        );
        sideWeightKg -= 15;
        num15--;
      } else if (num10 > 0 && sideWeightKg >= 10) {
        plates.push(
          <div key={"10-" + num10} className={styles.kg10}>
            10
          </div>
        );
        sideWeightKg -= 10;
        num10--;
      } else if (num5 > 0 && sideWeightKg >= 5) {
        plates.push(
          <div key={"5-" + num5} className={styles.kg5}>
            5
          </div>
        );
        sideWeightKg -= 5;
        num5--;
      } else if (num2p5 > 0 && sideWeightKg >= 2.5) {
        plates.push(
          <div key={"2p5-" + num2p5} className={styles.kg2p5}>
            2.5
          </div>
        );
        sideWeightKg -= 2.5;
        num2p5--;
      } else if (num1p25 > 0 && sideWeightKg >= 1.25) {
        plates.push(
          <div key={"1p25-" + num1p25} className={styles.kg1p25}>
            1¼
          </div>
        );
        sideWeightKg -= 1.25;
        num1p25--;
      } else if (num0p5 > 0 && sideWeightKg >= 0.5) {
        plates.push(
          <div key={"0p5-" + num0p5} className={styles.kg0p5}>
            ½
          </div>
        );
        sideWeightKg -= 0.5;
        num0p5--;
      } else if (num0p25 > 0 && sideWeightKg >= 0.25) {
        plates.push(
          <div key={"0p25-" + num0p25} className={styles.kg0p25}>
            ¼
          </div>
        );
        sideWeightKg -= 0.25;
        num0p25--;
      } else {
        plates.push(
          <div key={"error"} className={styles.error}>
            ?{sideWeightKg.toFixed(1)}
          </div>
        );
        sideWeightKg = 0;
      }
    }

    return plates;
  }

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
    ...state
  };
};

export default connect(
  mapStateToProps,
  null
)(Loading);
