// vim: set ts=2 sts=2 sw=2 et:
// @flow

import { combineReducers } from "redux";
import languageReducer from "./languageReducer";
import meetReducer from "./meetReducer";
import registrationReducer from "./registrationReducer";
import liftingReducer from "./liftingReducer";

import type { LanguageState } from "./languageReducer";
import type { MeetState } from "./meetReducer";
import type { RegistrationState } from "./registrationReducer";
import type { LiftingState } from "./liftingReducer";

export type GlobalState = {
  language: LanguageState,
  meet: MeetState,
  registration: RegistrationState,
  lifting: LiftingState
};

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
  registration: registrationReducer,
  lifting: liftingReducer
});
