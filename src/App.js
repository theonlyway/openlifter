// vim: set ts=2 sts=2 sw=2 et:

import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./store";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { addLocaleData } from "react-intl";
import es from "react-intl/locale-data/es";
import eo from "react-intl/locale-data/eo";
import OpenLifterIntlProvider from "./components/translations/OpenLifterIntlProvider";
import MeetSetupContainer from "./containers/MeetSetupContainer";
import ExamplesContainer from "./containers/ExamplesContainer";
import HomeContainer from "./containers/HomeContainer";
import Navigation from "./components/Navigation";

addLocaleData([...es, ...eo]);

class App extends Component {
  render() {
    return (
      // Provider is a React component from the react-redux library.
      // Its purpose is to "provide" the given store to its child components.
      // Because the Provider wraps the whole App here, the store is global state.
      //
      // Switch iterates over its children (Routes) and renders the first one that matches the current path name
      //
      // Route takes a path and a component, and renders the given component if the current path matches the specified path.
      <div>
        <Provider store={configureStore()}>
          <OpenLifterIntlProvider>
            <Router>
              <div>
                <Navigation />
                <Switch>
                  <Route exact path="/" component={HomeContainer} />
                  <Route path="/meet-setup" component={MeetSetupContainer} />
                  <Route path="/examples" component={ExamplesContainer} />
                </Switch>
              </div>
            </Router>
          </OpenLifterIntlProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
