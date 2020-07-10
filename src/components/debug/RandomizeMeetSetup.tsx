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

// Randomizes the Meet Setup state, for debugging.

import React from "react";
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";

import LocalizedString from "../translations/LocalizedString";

import { randomString, randomInt, randomFixedPoint } from "./RandomizeHelpers";

import {
  setDivisions,
  setFederation,
  setLengthDays,
  setMeetName,
  setPlatformsOnDays,
  setWeightClasses,
} from "../../actions/meetSetupActions";

import { GlobalState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import { Sex } from "../../types/dataTypes";

interface DispatchProps {
  setDivisions: (divisions: Array<string>) => void;
  setFederation: (federation: string) => void;
  setLengthDays: (length: number) => void;
  setMeetName: (name: string) => void;
  setPlatformsOnDays: (day: number, count: number) => void;
  setWeightClasses: (sex: Sex, classesKg: number[]) => void;
}

type Props = GlobalState & DispatchProps;

const NonsenseFederations = [
  "CTHULHU",
  "USPLAWH",
  "FIREFOX",
  "PIZZAHUT",
  "50% RAW",
  "TODDLERS",
  "COFFEE",
  "THEBORG",
  "LETITSNOW",
];

const NonsenseDivisions = ["Masters", "Juniors", "Lawyers", "Infants", "Turtles", "Rabbits"];

class RandomizeMeetSetupButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.randomizeMeetSetup = this.randomizeMeetSetup.bind(this);
  }

  randomizeMeetSetup() {
    // Set a gibberish MeetName.
    // ==========================================
    this.props.setMeetName(randomString() + randomString());

    // Generate a nonsense federation.
    // ==========================================
    const fed = NonsenseFederations[randomInt(0, NonsenseFederations.length - 1)];
    this.props.setFederation(fed);

    // Generate nonsense weight classes.
    // ==========================================
    const numClassesMen = randomInt(5, 12);
    const numClassesWomen = randomInt(4, 8);

    let classesMen = [];
    for (let i = 0; i < numClassesMen; i++) {
      classesMen.push(randomFixedPoint(40, 145, 1));
    }
    classesMen = classesMen.sort((a, b) => Number(a) - Number(b));

    let classesWomen = [];
    for (let i = 0; i < numClassesWomen; i++) {
      classesWomen.push(randomFixedPoint(35, 110, 1));
    }
    classesWomen = classesWomen.sort((a, b) => Number(a) - Number(b));

    let classesMx = [];
    for (let i = 0; i < numClassesWomen; i++) {
      classesMx.push(randomFixedPoint(40, 120, 1));
    }
    classesMx = classesMx.sort((a, b) => Number(a) - Number(b));

    this.props.setWeightClasses("M", classesMen);
    this.props.setWeightClasses("F", classesWomen);
    this.props.setWeightClasses("Mx", classesMx);

    // Generate nonsense days and platforms.
    // ==========================================
    const numDays = randomInt(1, 4);
    this.props.setLengthDays(numDays);

    for (let i = 0; i < numDays; i++) {
      const day = i + 1;
      const numPlatforms = randomInt(1, 2);
      this.props.setPlatformsOnDays(day, numPlatforms);
    }

    // Generate nonsense divisions.
    // ==========================================
    const numDivisions = randomInt(1, 20);
    const divisions = [];
    for (let i = 0; i < numDivisions; i++) {
      let div = NonsenseDivisions[randomInt(0, NonsenseDivisions.length - 1)];
      if (Math.random() > 0.5) {
        const age_lower = randomInt(1, 40);
        const age_upper = randomInt(age_lower + 1, 99);
        div = div + " " + String(age_lower) + "-" + String(age_upper);
      }

      // Disallow repeat divisions.
      if (divisions.indexOf(div) === -1) {
        divisions.push(div);
      }
    }
    this.props.setDivisions(divisions);
  }

  render() {
    return (
      <Button onClick={this.randomizeMeetSetup}>
        <LocalizedString id="nav.meet-setup" />
      </Button>
    );
  }
}

const mapStateToProps = (state: GlobalState): GlobalState => ({
  ...state,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setDivisions: (divisions: Array<string>) => dispatch(setDivisions(divisions)),
    setFederation: (federation: string) => dispatch(setFederation(federation)),
    setLengthDays: (length: number) => dispatch(setLengthDays(length)),
    setMeetName: (name: string) => dispatch(setMeetName(name)),
    setPlatformsOnDays: (day: number, count: number) => dispatch(setPlatformsOnDays(day, count)),
    setWeightClasses: (sex: Sex, classesKg: number[]) => dispatch(setWeightClasses(sex, classesKg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RandomizeMeetSetupButton);
