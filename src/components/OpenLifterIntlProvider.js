import * as React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import translations from "../translations/locales";

class OpenLifterIntlProvider extends React.Component {
  render() {
    const { lang } = this.props.languageReducer;
    // Load our translations from the json files
    const messages = translations[lang];
    return (
      // This is going to wrap any children passed to this component with an IntlProvider
      // This will put translations of all of our child components in our app
      <IntlProvider locale={lang} key={lang} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

OpenLifterIntlProvider.propTypes = {
  children: PropTypes.object.isRequired,
  languageReducer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ...state
});

export default connect(
  mapStateToProps,
  null
)(OpenLifterIntlProvider);
