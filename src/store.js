// vim: set ts=2 sts=2 sw=2 et:
//
// The redux store will:
// Hold application state
// Allow access to state via getState()
// Allow state change via dispatch(action)
// Register listeners via subscribe(listener)
// Handle unregistering of listeners

import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState = {}) {
  let store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return { store, persistor };
}
