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

// The left card on the lifting page, showing information about the current lifter
// and helpful information for the loading crew.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import { selectPlates, makeLoadingRelative } from "../../logic/barLoad";
import { liftToAttemptFieldName } from "../../logic/entry";
import { getString } from "../../logic/strings";
import { kg2lbs, displayWeightOnePlace } from "../../logic/units";

import BarLoad from "./BarLoad";

import styles from "./LeftCard.module.scss";

import { Entry, Language, LoadedPlate, Plate } from "../../types/dataTypes";
import { GlobalState, LiftingState, RegistrationState } from "../../types/stateTypes";

interface OwnProps {
  attemptOneIndexed: number;
  orderedEntries: Array<Entry>;
  currentEntryId: number | null;
  nextEntryId: number | null;
  nextAttemptOneIndexed: number | null;
}

interface StateProps {
  inKg: boolean;
  showAlternateUnits: boolean;
  squatBarAndCollarsWeightKg: number;
  benchBarAndCollarsWeightKg: number;
  deadliftBarAndCollarsWeightKg: number;
  plates: ReadonlyArray<Plate>;
  registration: RegistrationState;
  lifting: LiftingState;
  language: Language;
}

type Props = OwnProps & StateProps;

interface BarLoadOptions {
  weightKg: number;
  weightLbs: number;
  rackInfo: string;
}

class LeftCard extends React.Component<Props> {
  getBarLoadProps = (entryId: number | null, attemptOneIndexed: number | null): BarLoadOptions => {
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    // Defaults, in case of no lifter.
    if (entryId === null || entryId === undefined || attemptOneIndexed === null || attemptOneIndexed === undefined) {
      return { weightKg: 0, weightLbs: 0, rackInfo: "" };
    }

    const idx = this.props.registration.lookup[entryId];
    const entry = this.props.registration.entries[idx];

    const weightKg = entry[fieldKg][attemptOneIndexed - 1];
    const weightLbs = kg2lbs(weightKg);

    let rackInfo = "";
    if (lift === "S") rackInfo = entry.squatRackInfo;
    if (lift === "B") rackInfo = entry.benchRackInfo;

    return { weightKg, weightLbs, rackInfo };
  };

  getBarAndCollarsWeightKg = (): number => {
    switch (this.props.lifting.lift) {
      case "S":
        return this.props.squatBarAndCollarsWeightKg;
      case "B":
        return this.props.benchBarAndCollarsWeightKg;
      case "D":
        return this.props.deadliftBarAndCollarsWeightKg;
      default:
        return 0;
    }
  };

  render() {
    const current = this.getBarLoadProps(this.props.currentEntryId, this.props.attemptOneIndexed);
    const next = this.getBarLoadProps(this.props.nextEntryId, this.props.nextAttemptOneIndexed);

    // Show one decimal point, and omit it if possible.
    const language = this.props.language;
    const weightKgText = displayWeightOnePlace(current.weightKg, language);
    const weightLbsText = displayWeightOnePlace(current.weightLbs, language);

    const barAndCollarsWeightKg = this.getBarAndCollarsWeightKg();

    // Calculate both loadings.
    const currentLoading: Array<LoadedPlate> = selectPlates(
      current.weightKg,
      barAndCollarsWeightKg,
      this.props.plates,
      this.props.inKg,
    );
    const nextLoading: Array<LoadedPlate> = selectPlates(
      next.weightKg,
      barAndCollarsWeightKg,
      this.props.plates,
      this.props.inKg,
    );

    // Set the next loading relative to the current loading.
    if (next.weightKg >= current.weightKg) {
      makeLoadingRelative(nextLoading, currentLoading);
    }

    let nextEntryName = undefined;
    if (typeof this.props.nextEntryId === "number") {
      const idx = this.props.registration.lookup[this.props.nextEntryId];
      nextEntryName = this.props.registration.entries[idx].name;
    }

    const nextBarLoad =
      next.weightKg === 0 ? undefined : (
        <div className={styles.loadingBar}>
          <div className={styles.nextText}>
            <FormattedMessage
              id="lifting.next-up"
              defaultMessage="NEXT UP – {lifter}"
              values={{
                lifter: nextEntryName,
              }}
            />
          </div>
          <div className={styles.barArea}>
            <BarLoad
              key={String(next.weightKg) + next.rackInfo}
              loading={nextLoading}
              rackInfo={next.rackInfo}
              inKg={this.props.inKg}
            />
          </div>
        </div>
      );

    let attemptTemplate = "";
    if (this.props.inKg) {
      if (this.props.showAlternateUnits) {
        attemptTemplate = getString("lifting.current-weight-kg-lbs", language);
      } else {
        attemptTemplate = getString("lifting.current-weight-kg", language);
      }
    } else {
      if (this.props.showAlternateUnits) {
        attemptTemplate = getString("lifting.current-weight-lbs-kg", language);
      } else {
        attemptTemplate = getString("lifting.current-weight-lbs", language);
      }
    }

    return (
      <div className={styles.container}>
        <div className={styles.activeCard}>
          <div className={styles.loadingBar}>
            <div className={styles.attemptText}>
              {attemptTemplate.replace("{kg}", weightKgText).replace("{lbs}", weightLbsText)}
            </div>
            <div className={styles.barArea}>
              <BarLoad
                key={String(current.weightKg) + current.rackInfo}
                loading={currentLoading}
                rackInfo={current.rackInfo}
                inKg={this.props.inKg}
              />
            </div>
          </div>
        </div>
        {nextBarLoad}
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    inKg: state.meet.inKg,
    showAlternateUnits: state.meet.showAlternateUnits,
    squatBarAndCollarsWeightKg: state.meet.squatBarAndCollarsWeightKg,
    benchBarAndCollarsWeightKg: state.meet.benchBarAndCollarsWeightKg,
    deadliftBarAndCollarsWeightKg: state.meet.deadliftBarAndCollarsWeightKg,
    plates: state.meet.plates,
    registration: state.registration,
    lifting: state.lifting,
    language: state.language,
  };
};

export default connect(mapStateToProps)(LeftCard);
