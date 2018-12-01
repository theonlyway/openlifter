// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";
import App from "./App";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
