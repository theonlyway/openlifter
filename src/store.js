// vim: set ts=2 sts=2 sw=2 et:
//
// The redux store will:
// Hold application state
// Allow access to state via getState()
// Allow state change via dispatch(action)
// Register listeners via subscribe(listener)
// Handle unregistering of listeners

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

export default function configureStore(initialState = {}) {
  return createStore(rootReducer, applyMiddleware(thunk));
}
