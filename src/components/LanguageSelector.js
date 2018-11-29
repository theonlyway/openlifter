// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changeLanguage } from "../actions/languageActions";
import Select from "react-select";

// Allows react component to subscribe to redux state updates
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    changeLanguage: item => dispatch(changeLanguage(item.value))
  };
};

// Can we get these from the i18n lib somehow?
const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "eo", label: "Esperanto" }
];

class LanguageSelector extends React.Component {
  selectedLanguage = languages.find(lang => {
    return lang.value === this.props.languageReducer.lang;
  });
  render() {
    return (
      <div>
        <div>Select a language:</div>
        <Select value={this.selectedLanguage} onChange={this.props.changeLanguage} options={languages} />
      </div>
    );
  }
}

LanguageSelector.propTypes = {
  changeLanguage: PropTypes.func,
  languageReducer: PropTypes.shape({
    lang: PropTypes.string
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector);
