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
import { liftToAttemptFieldName, getWeightClassForEntry, getFinalTotalKg } from "../../logic/entry";
import { getString } from "../../logic/strings";
import { kg2lbs } from "../../logic/units";

import BarLoad from "./BarLoad";

import styles from "./LeftCard.module.scss";

import Logo from "./gpc-nz-square.png";

import { Entry, Language, LoadedPlate, RecordLift } from "../../types/dataTypes";
import { GlobalState, LiftingState, RegistrationState, MeetState, RecordsState } from "../../types/stateTypes";
import { isRecordAttempt, getRecordTypeForEntry, getUpdatedRecordState } from "../../logic/records/records";
import { checkExhausted } from "../../types/utils";
import { getProjectedResults, getFinalResults, getPlaceOrdinal } from "../../logic/divisionPlace";

interface OwnProps {
  attemptOneIndexed: number;
  orderedEntries: Array<Entry>;
  currentEntryId: number | null;
  nextEntryId: number | null;
  nextAttemptOneIndexed: number | null;
}

interface StateProps {
  registration: RegistrationState;
  meet: MeetState;
  updatedRecordState: RecordsState;

  lifting: LiftingState;
  language: Language;
}

type Props = OwnProps & StateProps;

interface BarLoadOptions {
  weightKg: number;
  weightLbs: number;
  rackInfo: string;
}

// Scuffed ordinal suffix calculation
function getOrdinalSuffix(i: number): string {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

class LeftCard extends React.Component<Props> {
  getBarLoadProps = (entryId: number | null, attemptOneIndexed: number | null): BarLoadOptions => {
    const lift = this.props.lifting.lift;
    const fieldKg = liftToAttemptFieldName(lift);

    // Defaults, in case of no lifter.
    if (entryId === null || entryId === undefined || attemptOneIndexed === null || attemptOneIndexed === undefined) {
      return { weightKg: 0, weightLbs: 0, rackInfo: "" };
    }

    const entry = this.getEntryById(entryId);

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
        return this.props.meet.squatBarAndCollarsWeightKg;
      case "B":
        return this.props.meet.benchBarAndCollarsWeightKg;
      case "D":
        return this.props.meet.deadliftBarAndCollarsWeightKg;
      default:
        return 0;
    }
  };

  private getEntryById(entryId: number) {
    const idx = this.props.registration.lookup[entryId];
    const entry = this.props.registration.entries[idx];
    return entry;
  }

  render() {
    const current = this.getBarLoadProps(this.props.currentEntryId, this.props.attemptOneIndexed);
    const next = this.getBarLoadProps(this.props.nextEntryId, this.props.nextAttemptOneIndexed);

    const barAndCollarsWeightKg = this.getBarAndCollarsWeightKg();

    // Calculate both loadings.
    const currentLoading: Array<LoadedPlate> = selectPlates(
      current.weightKg,
      barAndCollarsWeightKg,
      this.props.meet.plates,
      this.props.meet.inKg
    );
    const nextLoading: Array<LoadedPlate> = selectPlates(
      next.weightKg,
      barAndCollarsWeightKg,
      this.props.meet.plates,
      this.props.meet.inKg
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
              inKg={this.props.meet.inKg}
            />
          </div>
        </div>
      );

    return (
      <div className={styles.container}>
        <div className={styles.activeCard}>
          <div className={styles.loadingBar}>
            {this.renderStreamOverlayCard(current)}
            <div className={styles.barArea}>
              <BarLoad
                key={String(current.weightKg) + current.rackInfo}
                loading={currentLoading}
                rackInfo={current.rackInfo}
                inKg={this.props.meet.inKg}
              />
            </div>
          </div>
        </div>
        {nextBarLoad}
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <img className={styles.logo} src={Logo}></img>
        </div>
      </div>
    );
  }

  getRecordAttemptText(): string | null {
    if (this.props.currentEntryId === null || this.props.attemptOneIndexed === null) {
      return null;
    }
    const lift = this.props.lifting.lift;
    const recordTypesBroken: string[] = [];
    const currentEntry = this.getEntryById(this.props.currentEntryId);
    const canSetTotalRecords = getRecordTypeForEntry(currentEntry) === "FullPower" && lift === "D";

    const isLiftRecordAttempt = this.isRecordAttempt(currentEntry, lift);
    // Is it a record attempt for the lift?
    if (isLiftRecordAttempt) {
      let localizedLift: string = "";
      if (lift === "S") localizedLift = getString("lifting.records-squat", this.props.language);
      else if (lift === "B") localizedLift = getString("lifting.records-bench", this.props.language);
      else if (lift === "D") localizedLift = getString("lifting.records-deadlift", this.props.language);
      else {
        checkExhausted(lift);
      }

      recordTypesBroken.push(localizedLift);
    }

    // Total records are only announced during deadlifts in full power meets
    const isTotalRecordAttempt = canSetTotalRecords && this.isRecordAttempt(currentEntry, "Total");
    if (isTotalRecordAttempt) {
      recordTypesBroken.push(getString("lifting.records-total", this.props.language));
    }

    // If any records are being attempted, announce them
    if (recordTypesBroken.length > 0) {
      const officialOrUnOfficial = currentEntry.canBreakRecords
        ? getString("lifting.records-official", this.props.language)
        : getString("lifting.records-unofficial", this.props.language);
      let messageTemplate =
        recordTypesBroken.length == 1
          ? getString("lifting.records-attempt-1-record-notice", this.props.language).replace(
              "{Lift}",
              recordTypesBroken[0]
            )
          : getString("lifting.records-attempt-2-records-notice", this.props.language)
              .replace("{Lift1}", recordTypesBroken[0])
              .replace("{Lift2}", recordTypesBroken[1]);

      messageTemplate = messageTemplate.replace("{OfficialOrUnofficial}", officialOrUnOfficial);
      return messageTemplate;
    }
    return null;
  }

  renderStreamOverlayCard(barLoadProps: BarLoadOptions) {
    if (this.props.currentEntryId === null) {
      return null;
    }

    const useProjected = this.props.lifting.lift !== "D" || this.props.attemptOneIndexed < 2;
    const categoryResults = useProjected
      ? getProjectedResults(
          this.props.registration.entries,
          this.props.meet.weightClassesKgMen,
          this.props.meet.weightClassesKgWomen,
          this.props.meet.weightClassesKgMx,
          this.props.meet.combineSleevesAndWraps
        )
      : getFinalResults(
          this.props.registration.entries,
          this.props.meet.weightClassesKgMen,
          this.props.meet.weightClassesKgWomen,
          this.props.meet.weightClassesKgMx,
          this.props.meet.combineSleevesAndWraps
        );

    const entry = this.getEntryById(this.props.currentEntryId);
    let placeOrdinal = null;
    if (getFinalTotalKg(entry) !== 0) {
      placeOrdinal = getPlaceOrdinal(entry, categoryResults);
    }
    const placeOrdinalStr = placeOrdinal !== null ? ` · ${placeOrdinal}${getOrdinalSuffix(placeOrdinal)} place` : null;
    const weightClass = getWeightClassForEntry(
      entry,
      this.props.meet.weightClassesKgMen,
      this.props.meet.weightClassesKgWomen,
      this.props.meet.weightClassesKgMx,
      this.props.language
    );

    const weightClassPrefix = weightClass.endsWith("+") ? "" : "u";

    return (
      <div>
        <div className={styles.attemptText}>{entry.name}</div>
        <div className={styles.overlaySubTitle}>
          {entry.divisions[0]} · <span className={styles.weightClassPrefix}>{weightClassPrefix}</span>
          {weightClass}kg
          {placeOrdinalStr}
        </div>
        <div className={styles.overlayWeight}>
          {barLoadProps.weightKg}KG <span className={styles.overlayRecordText}>{this.getRecordAttemptText()}</span>
        </div>
      </div>
    );
  }

  private isRecordAttempt(entry: Entry, lift: RecordLift): boolean {
    return isRecordAttempt(
      this.props.updatedRecordState,
      this.props.meet,
      entry,
      lift,
      this.props.attemptOneIndexed,
      this.props.language
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    registration: state.registration,
    lifting: state.lifting,
    updatedRecordState: getUpdatedRecordState(state.records, state.meet, state.registration, state.language),
    meet: state.meet,
    language: state.language,
  };
};

export default connect(mapStateToProps)(LeftCard);
