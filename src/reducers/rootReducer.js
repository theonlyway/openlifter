// vim: set ts=2 sts=2 sw=2 et:

import { combineReducers } from "redux";
import sampleReducer from "./sampleReducer";
import languageReducer from "./languageReducer";

// Using the combineReducers utility, we can combine all reducers into a single index reducer
export default combineReducers({
  sampleReducer,
  languageReducer
});
