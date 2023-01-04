import { StreamingState } from "../types/stateTypes";
import { StreamingAction } from "../types/actionTypes";

type Action = StreamingAction;

const initialState: StreamingState = {
  streamingEnabled: false,
  databaseAuthentication: false,
  databaseType: "mongodb",
  databaseAddress: "localhost",
  databasePort: "27017",
  databaseUsername: "enterUsername",
  databasePassword: "enterPassword",
};

export default function streamingReducer(state: StreamingState = initialState, action: Action) {
  switch (action.type) {
    case "ENABLE_STREAMING":
      return { ...state, streamingEnabled: action.streamingEnabled };
    case "ENABLE_DATABASE_AUTHENTICATION":
      return { ...state, databaseAuthentication: action.databaseAuthentication };
    case "SET_STREAMING_DATABASE_TYPE":
      return { ...state, databaseType: action.databaseType };
    case "SET_STREAMING_DATABASE_ADDRESS":
      return { ...state, databaseAddress: action.databaseAddress };
    case "SET_STREAMING_DATABASE_PORT":
      return { ...state, databasePort: action.databasePort };
    case "SET_STREAMING_DATABASE_USERNAME":
      return { ...state, databaseUsername: action.databaseUsername };
    case "SET_STREAMING_DATABASE_PASSWORD":
      return { ...state, databasePassword: action.databasePassword };
    default:
      return state;
  }
}
