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
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { randomString, randomInt, randomFixedPoint } from "./RandomizeHelpers";

import {
  setDivisions,
  setFederation,
  setLengthDays,
  setMeetName,
  setPlatformsOnDays,
  setWeightClasses
} from "../../actions/meetSetupActions";

const NonsenseFederations = [
  "CTHULHU",
  "USPLAWH",
  "FIREFOX",
  "PIZZAHUT",
  "50% RAW",
  "TODDLERS",
  "COFFEE",
  "THEBORG",
  "LETITSNOW"
];

const NonsenseDivisions = ["Masters", "Juniors", "Lawyers", "Infants", "Turtles", "Rabbits"];

class RandomizeMeetSetupButton extends React.Component {
  constructor(props) {
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

    this.props.setWeightClasses("M", classesMen);
    this.props.setWeightClasses("F", classesWomen);

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
    let divisions = [];
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
    return <Button onClick={this.randomizeMeetSetup}>Meet Setup</Button>;
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    setDivisions: divisions => dispatch(setDivisions(divisions)),
    setFederation: federation => dispatch(setFederation(federation)),
    setLengthDays: length => dispatch(setLengthDays(length)),
    setMeetName: name => dispatch(setMeetName(name)),
    setPlatformsOnDays: (day, count) => dispatch(setPlatformsOnDays(day, count)),
    setWeightClasses: (sex, classesKg) => dispatch(setWeightClasses(sex, classesKg))
  };
};

RandomizeMeetSetupButton.propTypes = {
  setDivisions: PropTypes.func.isRequired,
  setFederation: PropTypes.func.isRequired,
  setLengthDays: PropTypes.func.isRequired,
  setMeetName: PropTypes.func.isRequired,
  setPlatformsOnDays: PropTypes.func.isRequired,
  setWeightClasses: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RandomizeMeetSetupButton);
