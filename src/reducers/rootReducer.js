// vim: set ts=2 sts=2 sw=2 et:

import { combineReducers } from "redux";
import languageReducer from "./languageReducer";
import meetReducer from "./meetReducer";
import liftingReducer from "./liftingReducer";

// Using combineReducers() guarantees that each part of the state object
// fully bears the responsibility of managing itself by only sending a
// subset of the state to the reducer.
//
// For example, the meetReducer() receives a new 'state' object
// equal to 'state.meet' from the root. Because there is no way to access
// the root state object from a child state object, the meetReducer() is
// fully-encapsulated, allowing for sane reasoning about effects on global state.
export default combineReducers({
  language: languageReducer,
  meet: meetReducer,
  lifting: liftingReducer
});
