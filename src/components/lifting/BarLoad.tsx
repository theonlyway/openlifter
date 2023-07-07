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

import { Language, Lift, LoadedPlate } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

import styles from "./BarLoad.module.scss";

const kgToStyleMap = new Map<number, string>([
  [50, styles.kg50],
  [25, styles.kg25],
  [20, styles.kg20],
  [15, styles.kg15],
  [10, styles.kg10],
  [5, styles.kg5],
  [2.5, styles.kg2p5],
  [1.25, styles.kg1p25],
  [1, styles.kg1],
  [0.75, styles.kg0p75],
  [0.5, styles.kg0p5],
  [0.25, styles.kg0p25],
]);

const weightKgToStyle = (weightKg: number): string => kgToStyleMap.get(weightKg) || styles.error;

const lbsToStyleMap = new Map<number, string>([
  [100, styles.lbs100],
  [55, styles.lbs55],
  [45, styles.lbs45],
  [35, styles.lbs35],
  [25, styles.lbs25],
  [10, styles.lbs10],
  [5, styles.lbs5],
  [2.5, styles.lbs2p5],
  [1.25, styles.lbs1p25],
  [0.5, styles.lbs0p5],
]);

const weightLbsToStyle = (weightLbs: number): string => lbsToStyleMap.get(weightLbs) || styles.error;

const weightTextMap = new Map<number, string>([
  [1.25, "1¼"],
  [0.75, "¾"],
  [0.5, "½"],
  [0.25, "¼"],
]);

const weightAnyToText = (weightAny: number, language: Language): string =>
  weightTextMap.get(weightAny) || displayWeight(weightAny, language);

interface PlateInfoProps {
  loading: LoadedPlate[];
  inKg: boolean;
  language: Language;
}

// Turns the selectPlates() array into divs.
const PlatesDiv: React.FC<PlateInfoProps> = ({ loading, inKg, language }) => {
  const divs = [];
  let i = 0;

  // Iterate on a group of plates of the same weight at a time.
  while (i < loading.length) {
    const weightAny = loading[i].weightAny;

    // If the weight is negative, it's an error report.
    if (weightAny < 0) {
      divs.push(
        <div key={"error"} className={styles.error}>
          ?{displayWeight(-1 * weightAny, language)}
        </div>,
      );
      break;
    }

    // Count how many times this same plate kind appears consecutively.
    let plateCount = 1;
    for (let j = i + 1; j < loading.length && loading[j].weightAny === weightAny; j++) {
      plateCount++;
    }

    // If that plate is large and occurs a bunch, show a counter.
    const showCounter = plateCount >= 3;

    // Push each of the plates individually.
    for (let j = 0; j < plateCount; j++) {
      const plate = loading[i + j];
      const counter = String(j + 1);

      // Light backgrounds need dark text.
      const is_light =
        plate.color === PlateColors.PLATE_DEFAULT_WHITE || plate.color === PlateColors.PLATE_DEFAULT_YELLOW;

      const style = {
        backgroundColor: plate.color,
        opacity: plate.isAlreadyLoaded ? 0.25 : undefined,
        color: is_light ? "#232323" : "#FFFFFF",
        // White plates need a border.
        border: plate.color === PlateColors.PLATE_DEFAULT_WHITE ? "1.5px solid #232323" : undefined,
      };

      divs.push(
        <div
          key={weightAny + "-" + counter}
          className={inKg ? weightKgToStyle(weightAny) : weightLbsToStyle(weightAny)}
          style={style}
        >
          <div>{weightAnyToText(weightAny, language)}</div>
          {showCounter ? <div>{counter}</div> : null}
        </div>,
      );
    }

    i += plateCount;
  }

  return <>{divs}</>;
};

interface RackInfoProps {
  lift: Lift;
  rackInfo: string;
}

const RackInfoDiv: React.FC<RackInfoProps> = ({ lift, rackInfo }) => {
  // Only show rack info for lifts that use a rack.
  if (lift === "D") return null;

  return (
    <div key={rackInfo} className={styles.rackInfo}>
      <FormattedMessage
        id="lifting.rack-info"
        defaultMessage="Rack {rackInfo}"
        values={{
          rackInfo: rackInfo,
        }}
      />
    </div>
  );
};

interface OwnProps {
  loading: Array<LoadedPlate>;
  rackInfo: string;
  inKg: boolean;
}

interface StateProps {
  lift: Lift;
  language: Language;
}

type Props = OwnProps & StateProps;

const BarLoad: React.FC<Props> = ({ lift, loading, inKg, language, rackInfo }) => (
  <div className={styles.container}>
    <div className={styles.bar} />
    <PlatesDiv loading={loading} inKg={inKg} language={language} />
    <div className={styles.collar} />
    <div className={styles.bar} />
    <RackInfoDiv lift={lift} rackInfo={rackInfo} />
  </div>
);

const mapStateToProps = (state: GlobalState): StateProps => ({
  lift: state.lifting.lift,
  language: state.language,
});

export default connect(mapStateToProps)(BarLoad);
