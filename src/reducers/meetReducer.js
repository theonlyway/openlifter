// vim: set ts=2 sts=2 sw=3 et:

import { combineReducers } from "redux";

function nameReducer(state = "", action) {
  switch (action.type) {
    case "SET_MEET_NAME":
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  name: nameReducer
});
