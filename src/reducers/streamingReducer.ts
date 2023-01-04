import { StreamingState } from "../types/stateTypes";
import { StreamingAction } from "../types/actionTypes";

type Action = StreamingAction;

const initialState: StreamingState = {
  enabled: false,
  databaseType: "mongodb",
  databaseAddress: "localhost",
};

export default function streamingReducer(state: StreamingState = initialState, action: Action) {
  switch (action.type) {
    case "ENABLE_STREAMING":
      return { ...state, enabled: action.enabled };
    case "SET_STREAMING_DATABASE_TYPE":
      return { ...state, databaseType: action.databaseType };
    case "SET_STREAMING_DATABASE_ADDRESS":
      return { ...state, databaseAddress: action.address };
    default:
      return state;
  }
}
