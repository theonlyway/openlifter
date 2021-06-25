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

// Defines a row in the LifterTable on the Weigh-ins page.
// This provides a bunch of widgets, each of which correspond to
// the state of a single entry.

import React from "react";
import { connect } from "react-redux";

import FormControl from "react-bootstrap/FormControl";

import ValidatedInput from "../ValidatedInput";
import WeightInput from "./WeightInput";

import { getAge } from "../../logic/entry";
import { getString, localizeFlight } from "../../logic/strings";
import { displayNumber } from "../../logic/units";
import { validatePositiveInteger } from "../../validation/positiveInteger";

import { updateRegistration } from "../../actions/registrationActions";

import { Entry, Language, Validation } from "../../types/dataTypes";
import { GlobalState, MeetState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import { assertFlight, assertString } from "../../types/utils";

interface OwnProps {
  id: number;
  inLiftingPage?: boolean;
}

interface StateProps {
  meet: MeetState;
  entry: Entry;
  language: Language;
}

interface DispatchProps {
  updateRegistration: (entryId: number, obj: Partial<Entry>) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class LifterRow extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateRegistrationFlight = this.updateRegistrationFlight.bind(this);
    this.updateRegistrationSquatRackInfo = this.updateRegistrationSquatRackInfo.bind(this);
    this.updateRegistrationBenchRackInfo = this.updateRegistrationBenchRackInfo.bind(this);
    this.updateRegistrationAge = this.updateRegistrationAge.bind(this);
  }

  updateRegistrationFlight = (event: React.BaseSyntheticEvent) => {
    const flight = event.currentTarget.value;
    if (this.props.entry.flight !== flight && assertString(flight) && assertFlight(flight)) {
      this.props.updateRegistration(this.props.id, { flight: flight });
    }
  };

  updateRegistrationSquatRackInfo = (value: string) => {
    if (this.props.entry.squatRackInfo !== value) {
      this.props.updateRegistration(this.props.id, { squatRackInfo: value });
    }
  };

  updateRegistrationBenchRackInfo = (value: string) => {
    if (this.props.entry.benchRackInfo !== value) {
      this.props.updateRegistration(this.props.id, { benchRackInfo: value });
    }
  };

  updateRegistrationAge = (value: string) => {
    const age: number = value === "" ? 0 : Number(value);
    if (this.props.entry.age !== age) {
      this.props.updateRegistration(this.props.id, { age: age });
    }
  };

  validateAge = (value?: string): Validation => {
    if (value === "") return null;

    const pos: Validation = validatePositiveInteger(value);
    if (pos === "success") {
      // Complain a little if the age is implausible.
      const n = Number(value);
      if (n <= 4 || n > 100) return "warning";
    }
    return pos;
  };

  validateRack = (value?: string): Validation => {
    if (value === "") return null;
    return "success";
  };

  render() {
    const language = this.props.language;
    const entry = this.props.entry;

    // Check whether the event(s) include a given lift.
    let hasSquat = false;
    let hasBench = false;
    let hasDeadlift = false;
    for (let i = 0; i < entry.events.length; i++) {
      const event = entry.events[i];
      if (event.includes("S")) {
        hasSquat = true;
      }
      if (event.includes("B")) {
        hasBench = true;
      }
      if (event.includes("D")) {
        hasDeadlift = true;
      }
    }

    // Check whether the first attempt already occurred.
    const disableSquatWeight = !hasSquat || entry.squatStatus[0] !== 0;
    const disableBenchWeight = !hasBench || entry.benchStatus[0] !== 0;
    const disableDeadliftWeight = !hasDeadlift || entry.deadliftStatus[0] !== 0;

    // Only show the Flight selector if the Weigh-ins page is non-embedded.
    let flight: string | JSX.Element = localizeFlight(entry.flight, language);
    if (this.props.inLiftingPage !== true) {
      // Can be undefined.
      flight = (
        <FormControl
          value={entry.flight}
          as="select"
          onChange={this.updateRegistrationFlight}
          className="custom-select"
        >
          <option value="A">{getString("flight.a", language)}</option>
          <option value="B">{getString("flight.b", language)}</option>
          <option value="C">{getString("flight.c", language)}</option>
          <option value="D">{getString("flight.d", language)}</option>
          <option value="E">{getString("flight.e", language)}</option>
          <option value="F">{getString("flight.f", language)}</option>
          <option value="G">{getString("flight.g", language)}</option>
          <option value="H">{getString("flight.h", language)}</option>
          <option value="I">{getString("flight.i", language)}</option>
          <option value="J">{getString("flight.j", language)}</option>
          <option value="K">{getString("flight.k", language)}</option>
          <option value="L">{getString("flight.l", language)}</option>
          <option value="M">{getString("flight.m", language)}</option>
          <option value="N">{getString("flight.n", language)}</option>
          <option value="O">{getString("flight.o", language)}</option>
          <option value="P">{getString("flight.p", language)}</option>
        </FormControl>
      );
    }

    const age = getAge(entry, this.props.meet.date);
    const ageStr = age === 0 ? getString("common.age", language) : displayNumber(age, language);

    return (
      <tr>
        <td>{entry.platform}</td>
        <td>{flight}</td>
        <td>{entry.name}</td>

        <td>
          <ValidatedInput
            initialValue={entry.age === 0 ? "" : displayNumber(entry.age, language)}
            placeholder={ageStr}
            validate={this.validateAge}
            onSuccess={this.updateRegistrationAge}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            field="bodyweightKg"
            placeholder={getString("weigh-ins.bodyweight-placeholder", language)}
            disabled={false}
          />
        </td>

        <td>
          <ValidatedInput
            initialValue={entry.squatRackInfo}
            placeholder={hasSquat ? getString("weigh-ins.squat-rack-placeholder", language) : undefined}
            disabled={!hasSquat}
            validate={this.validateRack}
            onSuccess={this.updateRegistrationSquatRackInfo}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="S"
            multipleOf={2.5}
            attemptOneIndexed={1}
            placeholder={hasSquat ? getString("weigh-ins.squat-placeholder", language) : undefined}
            disabled={disableSquatWeight}
          />
        </td>

        <td>
          <ValidatedInput
            initialValue={entry.benchRackInfo}
            placeholder={hasBench ? getString("weigh-ins.bench-rack-placeholder", language) : undefined}
            disabled={!hasBench}
            validate={this.validateRack}
            onSuccess={this.updateRegistrationBenchRackInfo}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="B"
            multipleOf={2.5}
            attemptOneIndexed={1}
            placeholder={hasBench ? getString("weigh-ins.bench-placeholder", language) : undefined}
            disabled={disableBenchWeight}
          />
        </td>

        <td>
          <WeightInput
            id={this.props.id}
            lift="D"
            multipleOf={2.5}
            attemptOneIndexed={1}
            placeholder={hasDeadlift ? getString("weigh-ins.deadlift-placeholder", language) : undefined}
            disabled={disableDeadliftWeight}
          />
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  // Only have props for the entry corresponding to this one row.
  const lookup = state.registration.lookup;
  const entry = state.registration.entries[lookup[ownProps.id]];

  return {
    meet: state.meet,
    entry: entry,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    updateRegistration: (entryId: number, obj: Partial<Entry>) => dispatch(updateRegistration(entryId, obj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LifterRow);
