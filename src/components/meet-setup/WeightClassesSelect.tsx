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

import Form from "react-bootstrap/Form";

import CreatableSelect from "react-select/creatable";

import { getString } from "../../logic/strings";
import { string2number, displayWeight } from "../../logic/units";

import { setWeightClasses } from "../../actions/meetSetupActions";

import { Language, Sex } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";
import { checkExhausted } from "../../types/utils";
import { Dispatch } from "redux";

const components = {
  DropdownIndicator: null,
};

type OptionType = {
  label: string;
  value: string;
};

const createOption = (label: string): OptionType => ({
  label,
  value: label.replace(",", "."),
});

interface OwnProps {
  label: string;
  sex: Sex;
}

interface StateProps {
  classes: ReadonlyArray<number>;
  language: Language;
}

interface DispatchProps {
  setWeightClasses: (sex: Sex, classesKg: ReadonlyArray<number>) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface InternalState {
  inputValue: string;
  value: Array<OptionType>;
}

class WeightClassesSelect extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    const objarray: Array<OptionType> = [];
    for (let i = 0; i < props.classes.length; i++) {
      const c = displayWeight(props.classes[i], props.language);
      objarray.push(createOption(c));
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

  // Updates the Redux store if a weightclass was added or removed.
  // Since updates are synchronous, we can simply check length.
  maybeUpdateRedux = (objarray: Array<OptionType>): void => {
    if (objarray.length === this.props.classes.length) {
      return;
    }

    // The classes changed: save to Redux.
    const classes = [];
    for (let i = 0; i < objarray.length; i++) {
      classes.push(Number(objarray[i].value));
    }
    this.props.setWeightClasses(this.props.sex, classes);
  };

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

  // Handles the case of creating a new weightclass.
  handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      const asNumber = string2number(inputValue);

      // Disallow creating non-numeric inputs.
      if (isNaN(asNumber) || !isFinite(asNumber)) {
        this.setState({ inputValue: "" });
        event.preventDefault();
        return;
      }

      // Disallow negative inputs.
      // The string check is for negative zero.
      if (asNumber < 0 || inputValue.includes("-")) {
        this.setState({ inputValue: "" });
        event.preventDefault();
        return;
      }

      // Disallow creating redundant classes.
      for (let i = 0; i < value.length; i++) {
        if (string2number(value[i].label) === asNumber) {
          // Silently drop the redundant weightclass.
          this.setState({ inputValue: "" });
          event.preventDefault();
          return;
        }
      }

      // Sort the new value into the array.
      let newValue = [...value, createOption(inputValue)];
      newValue = newValue.sort((a, b) => Number(a.value) - Number(b.value));

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
    const placeholder = getString("meet-setup.placeholder-classes", this.props.language);

    return (
      <Form.Group>
        <Form.Label>{this.props.label}</Form.Label>
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

const selectClassesBySex = (sex: Sex, state: GlobalState): ReadonlyArray<number> => {
  switch (sex) {
    case "M":
      return state.meet.weightClassesKgMen;
    case "F":
      return state.meet.weightClassesKgWomen;
    case "Mx":
      return state.meet.weightClassesKgMx;
    default:
      checkExhausted(sex);
      return state.meet.weightClassesKgMen;
  }
};

const mapStateToProps = (state: GlobalState, ownProps: OwnProps): StateProps => {
  return {
    classes: selectClassesBySex(ownProps.sex, state),
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setWeightClasses: (sex, classesKg) => dispatch(setWeightClasses(sex, classesKg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeightClassesSelect);
