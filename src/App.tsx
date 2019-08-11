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
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./store";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { addLocaleData } from "react-intl";
import es from "react-intl/locale-data/es";
import eo from "react-intl/locale-data/eo";
import OpenLifterIntlProvider from "./components/translations/OpenLifterIntlProvider";

import RootContainer from "./containers/RootContainer";
import MeetSetupContainer from "./containers/MeetSetupContainer";
import RegistrationContainer from "./containers/RegistrationContainer";
import WeighinsContainer from "./containers/WeighinsContainer";
import LiftingContainer from "./containers/LiftingContainer";
import FlightOrderContainer from "./containers/FlightOrderContainer";
import ResultsContainer from "./containers/ResultsContainer";
import DebugContainer from "./containers/DebugContainer";
import AboutContainer from "./containers/AboutContainer";
import Navigation from "./components/Navigation";

addLocaleData([...es, ...eo]);

class App extends React.Component {
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
            <Router basename={process.env.REACT_APP_ROUTER_BASENAME}>
              <div>
                <Navigation />
                <Switch>
                  <Route exact path="/" component={RootContainer} />
                  <Route path="/meet-setup" component={MeetSetupContainer} />
                  <Route path="/registration" component={RegistrationContainer} />
                  <Route path="/weigh-ins" component={WeighinsContainer} />
                  <Route path="/flight-order" component={FlightOrderContainer} />
                  <Route path="/lifting" component={LiftingContainer} />
                  <Route path="/results" component={ResultsContainer} />
                  <Route path="/debug" component={DebugContainer} />
                  <Route path="/about" component={AboutContainer} />
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
