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

// Randomizes the Registration page, for debugging.

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Button from "react-bootstrap/Button";

import LocalizedString from "../translations/LocalizedString";

import { randomInt } from "./RandomizeHelpers";
import { newRegistration, deleteRegistration } from "../../actions/registrationActions";

import { GlobalState } from "../../types/stateTypes";
import { Event, Entry, Sex, Equipment, Flight } from "../../types/dataTypes";

const NonsenseFirstNames = [
  "Aragorn",
  "Arwen",
  "Aule",
  "Balin",
  "Beorn",
  "Beregond",
  "Bert",
  "Bifur",
  "Bilbo",
  "Bofur",
  "Bolg",
  "Bombur",
  "Boromir",
  "Bregalad",
  "Bullroarer",
  "Bungo",
  "Carc",
  "Celeborn",
  "Dain",
  "Denethor",
  "Dori",
  "Dwalin",
  "Elrohir",
  "Elrond",
  "Eomer",
  "Eowyn",
  "Este",
  "Faramir",
  "Fili",
  "Fredegar",
  "Frodo",
  "Galadriel",
  "Galion",
  "Gandalf",
  "Gimli",
  "Gloin",
  "Glorfindel",
  "Golfimbul",
  "Gollum",
  "Gothmog",
  "Grima",
  "Imrahil",
  "Kili",
  "Legolas",
  "Lorien",
  "Mandos",
  "Manwe",
  "Melkor",
  "Meriadoc",
  "Nessa",
  "Nienna",
  "Nori",
  "Oin",
  "Ori",
  "Orome",
  "Peregrin",
  "Pippin",
  "Radagast",
  "Roac",
  "Samwise",
  "Saruman",
  "Sauron",
  "Shelob",
  "Smaug",
  "Theoden",
  "Thorin",
  "Thranduil",
  "Tom",
  "Treebeard",
  "Tulkas",
  "Ulmo",
  "Vaire",
  "Vana",
  "Varda",
  "William",
  "Yavanna",
];

const NonsenseLastNames = [
  "Black",
  "Burbage",
  "Carrow",
  "Cattermole",
  "Chang",
  "Clearwater",
  "Crabbe",
  "Creevey",
  "Crouch",
  "Delacour",
  "Diggory",
  "Dumbledore",
  "Dursley",
  "Edgecombe",
  "Filch",
  "Flitwick",
  "Fudge",
  "Goyle",
  "Granger",
  "Grindelwald",
  "Hagrid",
  "Hufflepuff",
  "Kettleburn",
  "Lockhart",
  "Longbottom",
  "Lovegood",
  "Lupin",
  "Malfoy",
  "Marchbanks",
  "McGonagall",
  "McLaggen",
  "Moody",
  "Nott",
  "Ogden",
  "Ollivander",
  "Parkinson",
  "Pettigrew",
  "Peverell",
  "Pince",
  "Podmore",
  "Pomfrey",
  "Potter",
  "Quirrell",
  "Riddle",
  "Rookwood",
  "Rowle",
  "Runcorn",
  "Scrimgeour",
  "Shacklebolt",
  "Shunpike",
  "Sinistra",
  "Slughorn",
  "Slytherin",
  "Snape",
  "Spinnet",
  "Sprout",
  "Thicknesse",
  "Tonks",
  "Trelawney",
  "Twycross",
  "Umbridge",
  "Vance",
  "Voldemort",
  "Weasley",
  "Wood",
  "Yaxley",
  "Zabini",
];

interface DispatchProps {
  newRegistration: (obj: Partial<Entry>) => void;
  deleteRegistration: (entryId: number) => void;
}

type Props = GlobalState & DispatchProps;

class RandomizeRegistrationButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.deleteExistingRegistrations = this.deleteExistingRegistrations.bind(this);
    this.generateEntries = this.generateEntries.bind(this);
    this.randomizeRegistration = this.randomizeRegistration.bind(this);
  }

  deleteExistingRegistrations() {
    const entryIds = this.props.registration.entries.map((e) => e.id);
    for (let i = 0; i < entryIds.length; i++) {
      this.props.deleteRegistration(entryIds[i]);
    }
  }

  // Generate entries in a flight together, in case we want to give them
  // similar properties.
  generateEntries(day: number, platform: number, flight: Flight) {
    const numLifters = randomInt(6, 18);

    for (let i = 0; i < numLifters; i++) {
      // Set a nonsense Name.
      // ==========================================
      const firstName = NonsenseFirstNames[randomInt(0, NonsenseFirstNames.length - 1)];
      const lastName = NonsenseLastNames[randomInt(0, NonsenseLastNames.length - 1)];
      const name = firstName + " " + lastName;

      // Set a random Sex.
      // ==========================================
      const sexes: Sex[] = ["M", "F", "Mx"];
      const sex: Sex = sexes[randomInt(0, sexes.length - 1)];

      // 10% chance they're a guest.
      // ==========================================
      const isGuest: boolean = randomInt(1, 10) === 1;

      // Assign a random Team.
      // ==========================================
      const teams: string[] = ["Team Red", "Team Green", "Team Blue"];
      const team: string = teams[randomInt(0, teams.length - 1)];

      // Generate random events, making most lifters SBD.
      // ==========================================
      const events: Event[] = [];
      if (Math.random() < 0.5) {
        events.push("SBD");
      }
      if (Math.random() < 0.1) {
        events.push("BD");
      }
      if (Math.random() < 0.1) {
        events.push("S");
      }
      if (Math.random() < 0.1) {
        events.push("B");
      }
      if (Math.random() < 0.1) {
        events.push("D");
      }
      if (events.length === 0) {
        events.push("SBD");
      }

      // Generate random equipment, making most lifters SBD,
      // being careful that it matches their events.
      // ==========================================
      let hasSquat = false;
      for (let i = 0; i < events.length; i++) {
        if (events[i].includes("S")) {
          hasSquat = true;
          break;
        }
      }

      const equipmentSelect = Math.random();
      let equipment: Equipment = "Sleeves";
      if (equipmentSelect < 0.7) {
        // Nothing, sleeves default case.
      } else if (equipmentSelect < 0.9) {
        if (hasSquat) {
          equipment = "Wraps";
        }
      } else if (equipmentSelect < 0.95) {
        equipment = "Single-ply";
      } else if (equipmentSelect < 0.98) {
        equipment = "Multi-ply";
      } else {
        equipment = "Unlimited";
      }

      // File into random divisions.
      // ==========================================
      const divisions = [];
      if (this.props.meet.divisions.length > 0) {
        const divisionsUpperBound = Math.max(1, this.props.meet.divisions.length - 1);
        const numDivisions = randomInt(1, divisionsUpperBound);

        // List of remaining available divisions.
        const divchooser = this.props.meet.divisions.slice();

        for (let i = 0; i < numDivisions; i++) {
          const choice = randomInt(0, divchooser.length - 1);
          divisions.push(divchooser[choice]);

          // Delete the choice from the list of available divisions.
          divchooser.splice(choice, 1);
        }
      }

      this.props.newRegistration({
        day: day,
        platform: platform,
        flight: flight,
        name: name,
        sex: sex,
        team: team,
        events: events,
        equipment: equipment,
        divisions: divisions,
        guest: isGuest,
      });
    }
  }

  randomizeRegistration() {
    const FLIGHTCHARS: Flight[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

    this.deleteExistingRegistrations();
    for (let day = 1; day <= this.props.meet.lengthDays; day++) {
      const numPlatforms = this.props.meet.platformsOnDays[day - 1];
      for (let platform = 1; platform <= numPlatforms; platform++) {
        const numFlights = randomInt(1, 3);
        for (let flight = 0; flight < numFlights; flight++) {
          this.generateEntries(day, platform, FLIGHTCHARS[flight]);
        }
      }
    }
  }

  render() {
    return (
      <Button onClick={this.randomizeRegistration}>
        <LocalizedString id="nav.registration" />
      </Button>
    );
  }
}

const mapStateToProps = (state: GlobalState): GlobalState => ({
  ...state,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    newRegistration: (obj: Partial<Entry>) => dispatch(newRegistration(obj)),
    deleteRegistration: (entryId: number) => dispatch(deleteRegistration(entryId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RandomizeRegistrationButton);
