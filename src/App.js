// vim: set ts=2 sts=2 sw=2 et:

import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./store";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { addLocaleData } from "react-intl";
import es from "react-intl/locale-data/es";
import eo from "react-intl/locale-data/eo";
import OpenLifterIntlProvider from "./components/translations/OpenLifterIntlProvider";

import HomeContainer from "./containers/HomeContainer";
import MeetSetupContainer from "./containers/MeetSetupContainer";
import RegistrationContainer from "./containers/RegistrationContainer";
import WeighinsContainer from "./containers/WeighinsContainer";
import LiftingContainer from "./containers/LiftingContainer";
import FlightOrderContainer from "./containers/FlightOrderContainer";
import ResultsContainer from "./containers/ResultsContainer";
import DebugContainer from "./containers/DebugContainer";
import Navigation from "./components/Navigation";

addLocaleData([...es, ...eo]);

class App extends Component {
  render() {
    let { store, persistor } = configureStore();

    return (
      // Provider is a React component from the react-redux library.
      // Its purpose is to "provide" the given store to its child components.
      // Because the Provider wraps the whole App here, the store is global state.
      //
      // Switch iterates over its children (Routes) and renders the first one that matches the current path name
      //
      // Route takes a path and a component, and renders the given component if the current path matches the specified path.
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <OpenLifterIntlProvider>
            <Router>
              <div>
                <Navigation />
                <Switch>
                  <Route exact path="/" component={HomeContainer} />
                  <Route path="/meet-setup" component={MeetSetupContainer} />
                  <Route path="/registration" component={RegistrationContainer} />
                  <Route path="/weigh-ins" component={WeighinsContainer} />
                  <Route path="/flight-order" component={FlightOrderContainer} />
                  <Route path="/lifting" component={LiftingContainer} />
                  <Route path="/results" component={ResultsContainer} />
                  <Route path="/debug" component={DebugContainer} />
                </Switch>
              </div>
            </Router>
          </OpenLifterIntlProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
