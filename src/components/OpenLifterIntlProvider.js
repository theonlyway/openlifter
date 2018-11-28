import * as React from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";
import translations from "../translations/locales";

class OpenLifterIntlProvider extends React.Component {
  render() {
    // TODO: Get locale dynamically from somewhere, like a language dropdown that sets a cookie
    const loc = "en";
    // Load our translations from the json files
    const messages = translations[loc];
    return (
      // This is going to wrap any children passed to this component with an IntlProvider
      // This will put translations of all of our child components in our app
      <IntlProvider locale={loc} key={loc} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

OpenLifterIntlProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export default OpenLifterIntlProvider;
