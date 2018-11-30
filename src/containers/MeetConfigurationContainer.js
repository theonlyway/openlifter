// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import MeetConfiguration from "../components/meetConfiguration/MeetConfiguration";

class MeetConfigurationContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Meet Configuration</h1>
        <MeetConfiguration />
      </div>
    );
  }
}

export default MeetConfigurationContainer;
