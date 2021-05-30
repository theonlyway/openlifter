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

// Provides widgets that overwrite rules with federation defaults.

import React, { FormEvent } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { getString } from "../../logic/strings";

import { updateMeet } from "../../actions/meetSetupActions";

import { GlobalState, MeetState } from "../../types/stateTypes";
import { Language } from "../../types/dataTypes";
import { checkExhausted, FormControlTypeHack } from "../../types/utils";
import { Dispatch } from "redux";

interface StateProps {
  federation: string;
  language: Language;
}

interface DispatchProps {
  updateMeet: (changes: Partial<MeetState>) => void;
}

interface OwnProps {
  // Used by the MeetSetup component to cause component updates.
  onChange: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

type AutoFillOption =
  | "GPC-AUS"
  | "Novice"
  | "Ladies of Lifting";

interface InternalState {
  selectedOption: AutoFillOption;
}



const gpcAusDefaults: Partial<MeetState> = {
  divisions: [
    "F-OE",
    "F-OR",
    "M-OE",
    "M-OR",
  ],
  weightClassesKgMen: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 110],
  weightClassesKgMx: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Glossbrenner",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: true,
};

const NoviceDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
  ],
  weightClassesKgMen: [],
  weightClassesKgWomen: [],
  weightClassesKgMx: [],
  formula: "Total",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: false,
};

const LadiesofLiftingDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
  ],
  weightClassesKgMen: [],
  weightClassesKgWomen: [80],
  weightClassesKgMx: [],
  formula: "Total",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: false,
};


class AutoFillRules extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      selectedOption: "GPC-AUS",
    };
  }

  handleSelectChange = (event: FormEvent<FormControlTypeHack>) => {
    const value = event.currentTarget.value as AutoFillOption;
    // Only handle any valid values & assist the compiler in giving us a compile error if AutoFillOption has more values added
    switch (value) {
      case "GPC-AUS":
      case "Novice":
      case "Ladies of Lifting":
        this.setState({ selectedOption: value });
        break;

      default:
        checkExhausted(value);
        throw new Error(`Expected a value that corresponds to an AutoFillOption, instead got "${value}"`);
    }
  };

  handleClick = () => {
    switch (this.state.selectedOption) {
      case "GPC-AUS":
        this.props.updateMeet(gpcAusDefaults);
        this.props.onChange();
        return;
      case "Novice":
        this.props.updateMeet(NoviceDefaults);
        this.props.onChange();
        return;  
      case "Ladies of Lifting":
        this.props.updateMeet(LadiesofLiftingDefaults);
        this.props.onChange();
        return;  
      default:
        checkExhausted(this.state.selectedOption);
        return;
    }
  };

  render() {
    const lang = this.props.language;

    const stringGPCAus = getString("meet-setup.rules-gpc-aus", lang);
    const stringNovice = getString("meet-setup.rules-novice", lang);
    const stringLadiesofLifting = getString("meet-setup.rules-ladiesoflifting", lang);

    return (
      <div>
        <FormGroup>
          <Form.Label>
            <FormattedMessage id="meet-setup.label-auto-fill-rules" defaultMessage="Auto-Fill Rules" />
          </Form.Label>
          <div>
            <FormControl
              as="select"
              onChange={this.handleSelectChange}
              value={this.state.selectedOption}
              style={{ width: "70%", display: "inline-block" }}
              className="custom-select"
            >
              <option key="GPC-AUS" value="GPC-AUS">
                {stringGPCAus}
              </option>
              <option key="Novice" value="Novice">
                {stringNovice}
              </option>  
              <option key="Ladies of Lifting" value="Ladies of Lifting">
                {stringLadiesofLifting}
              </option>            
            </FormControl>

            <Button onClick={this.handleClick} variant="primary" style={{ width: "25%", marginLeft: "5%" }}>
              <FormattedMessage id="meet-setup.button-autofill" defaultMessage="Auto-Fill" />
            </Button>
          </div>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  federation: state.meet.federation,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    updateMeet: (changes) => dispatch(updateMeet(changes)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoFillRules);
