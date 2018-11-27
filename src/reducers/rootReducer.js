import { combineReducers } from "redux";
import sampleReducer from "./sampleReducer";

// Using the combineReducers utility, we can combine all reducers into a single index reducer
export default combineReducers({
  sampleReducer
});
