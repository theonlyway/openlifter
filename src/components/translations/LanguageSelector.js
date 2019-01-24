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
import PropTypes from "prop-types";
import { changeLanguage } from "../../actions/languageActions";
import Select from "react-select";
import styles from "./LanguageSelector.module.scss";

// Can we get these from the i18n lib somehow?
const languages = [{ value: "en", label: "English" }, { value: "eo", label: "Esperanto" }];

class LanguageSelector extends React.Component {
  selectedLanguage = languages.find(lang => {
    return lang.value === this.props.language;
  });
  render() {
    return (
      <span>
        <Select
          className={styles.languageSelector}
          value={this.selectedLanguage}
          onChange={this.props.changeLanguage}
          options={languages}
        />
      </span>
    );
  }
}

LanguageSelector.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
};

// Allows react component to subscribe to redux state updates
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    changeLanguage: item => dispatch(changeLanguage(item.value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector);
