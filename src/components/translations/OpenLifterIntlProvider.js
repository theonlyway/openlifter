// vim: set ts=2 sts=2 sw=2 et:

import * as React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import translations from "../../translations/locales";

class OpenLifterIntlProvider extends React.Component {
  render() {
    const language = this.props.language;

    // Load our translations from the json files
    const messages = translations[language];

    return (
      // This is going to wrap any children passed to this component with an IntlProvider
      // This will put translations of all of our child components in our app
      <IntlProvider locale={language} key={language} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

OpenLifterIntlProvider.propTypes = {
  children: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(OpenLifterIntlProvider);
