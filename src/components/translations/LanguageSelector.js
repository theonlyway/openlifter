// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changeLanguage } from "../../actions/languageActions";
import Select from "react-select";
import styled from "styled-components";

const LanguageSelect = styled(Select)`
  width: 150px;
`;

// Can we get these from the i18n lib somehow?
const languages = [{ value: "en", label: "English" }, { value: "eo", label: "Esperanto" }];

class LanguageSelector extends React.Component {
  selectedLanguage = languages.find(lang => {
    return lang.value === this.props.language;
  });
  render() {
    return (
      <span>
        <LanguageSelect value={this.selectedLanguage} onChange={this.props.changeLanguage} options={languages} />
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
