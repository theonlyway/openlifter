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

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Form from "react-bootstrap/Form";

import CreatableSelect from "react-select/creatable";

import { getString } from "../../logic/strings";

import { setDivisions } from "../../actions/meetSetupActions";

import { GlobalState } from "../../types/stateTypes";
import { Language } from "../../types/dataTypes";
import { Dispatch } from "redux";

const components = {
  DropdownIndicator: null,
};

interface OptionType {
  label: string;
  value: string;
}

const createOption = (label: string): OptionType => ({
  label,
  value: label,
});

interface StateProps {
  divisions: ReadonlyArray<string>;
  language: Language;
}

interface DispatchProps {
  setDivisions: (divisions: ReadonlyArray<string>) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  inputValue: string;
  value: Array<OptionType>;
}

class DivisionSelect extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    const objarray = [];
    for (let i = 0; i < props.divisions.length; i++) {
      const division = props.divisions[i];
      objarray.push({ value: division, label: division });
    }

    this.state = {
      inputValue: "",
      value: objarray,
    };

    this.maybeUpdateRedux = this.maybeUpdateRedux.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Updates the Redux store if a division was added or removed.
  // Since updates are synchronous, we can simply check length.
  maybeUpdateRedux = (objarray: Array<OptionType>): void => {
    // objarray is a list of {value: "foo", label: "foo"} objects.
    if (objarray.length === this.props.divisions.length) {
      return;
    }

    // The divisions changed: save to Redux.
    const divisions = [];
    for (let i = 0; i < objarray.length; i++) {
      divisions.push(objarray[i].label);
    }
    this.props.setDivisions(divisions);
  };

  // Handles the case of deleting an existing division.
  handleChange = (value: any): void => {
    if (value instanceof Array) {
      this.setState({ value: value });
      this.maybeUpdateRedux(value);
    } else if (value === null) {
      this.setState({ value: [] });
      this.maybeUpdateRedux([]);
    }
  };

  // Reflects the current typing status in the state.
  handleInputChange = (inputValue: string): void => {
    this.setState({ inputValue: inputValue });
  };

  // Handles the case of creating a new division.
  handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      // Disallow creating redundant divisions.
      for (let i = 0; i < value.length; i++) {
        if (value[i].label === inputValue) {
          // Silently drop the redundant division.
          this.setState({ inputValue: "" });
          event.preventDefault();
          return;
        }
      }

      const newValue = [...value, createOption(inputValue)];
      this.setState({
        inputValue: "",
        value: newValue,
      });
      this.maybeUpdateRedux(newValue);
      event.preventDefault();
    }
  };

  render() {
    const { inputValue, value } = this.state;
    const placeholder = getString("meet-setup.divisions-placeholder", this.props.language);
    return (
      <Form.Group>
        <Form.Label>
          <FormattedMessage id="meet-setup.divisions-label" defaultMessage="Divisions (prefer short codes!)" />
        </Form.Label>
        <CreatableSelect
          components={components}
          inputValue={inputValue}
          isMulti
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
          value={value}
        />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  divisions: state.meet.divisions,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setDivisions: (divisions) => dispatch(setDivisions(divisions)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionSelect);
