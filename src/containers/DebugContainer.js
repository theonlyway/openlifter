// vim: set ts=2 sts=2 sw=2 et:
//
// A page dedicated to debugging tools.

import React from "react";

import StateTools from "../components/debug/StateTools";

const DebugContainer = () => {
  return (
    <div style={{ marginRight: "40px", marginLeft: "40px" }}>
      <StateTools />
    </div>
  );
};

export default DebugContainer;
