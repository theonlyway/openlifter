import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as serviceWorker from "./serviceWorker";
import configureStore from "./store";
import App from "./App";

import "./index.css";

ReactDOM.render(
  // Provider is a React component from the react-redux library.
  // Its purpose is to "provide" the given store to its child components.
  // Because the Provider wraps the whole App here, the store is global state.
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
