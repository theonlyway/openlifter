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

// The RootContainer manually implements route parsing from GET parameters.
//
// The issue is that because OpenLifter is statically hosted, only the base
// "/" route actually contains the index.html of the application. The other
// routes (such as "/lifting") have index.html files that redirect to "/".
//
// We've changed things so that "/lifting/index.html" redirects to "/?lifting".
// But React Router isn't able to route based on GET parameters.
//
// Therefore it's set up so that "/" routes to this RootContainer,
// and the RootContainer inspects the GET parameters and renders the
// appropriate container.

import React from "react";

import HomeContainer from "./HomeContainer";
import MeetSetupContainer from "./MeetSetupContainer";
import RegistrationContainer from "./RegistrationContainer";
import WeighinsContainer from "./WeighinsContainer";
import LiftingContainer from "./LiftingContainer";
import FlightOrderContainer from "./FlightOrderContainer";
import ResultsContainer from "./ResultsContainer";
import DebugContainer from "./DebugContainer";
import AboutContainer from "./AboutContainer";

class RootContainer extends React.Component {
  render() {
    if (typeof window.location.search !== "string") {
      return <HomeContainer />;
    }

    switch (window.location.search) {
      case "?meet-setup":
        return <MeetSetupContainer />;
      case "?registration":
        return <RegistrationContainer />;
      case "?weigh-ins":
        return <WeighinsContainer />;
      case "?flight-order":
        return <FlightOrderContainer />;
      case "?lifting":
        return <LiftingContainer />;
      case "?results":
        return <ResultsContainer />;
      case "?debug":
        return <DebugContainer />;
      case "?about":
        return <AboutContainer />;
      default:
        return <HomeContainer />;
    }
  }
}

export default RootContainer;
