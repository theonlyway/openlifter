// vim: set ts=2 sts=2 sw=2 et:

import { combineReducers } from "redux";
import languageReducer from "./languageReducer";
import meetReducer from "./meetReducer";

// Using the combineReducers utility, we can combine all reducers into a single index reducer
export default combineReducers({
  language: languageReducer,
  meet: meetReducer
});
