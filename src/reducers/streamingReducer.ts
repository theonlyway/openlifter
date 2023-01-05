import { StreamingState } from "../types/stateTypes";
import { StreamingAction } from "../types/actionTypes";

type Action = StreamingAction;

const initialState: StreamingState = {
  streamingEnabled: false,
  apiUrl: "http://localhost",
  apiAuthentication: false,
  apiKey: "developmentKey",
};

export default function streamingReducer(state: StreamingState = initialState, action: Action) {
  switch (action.type) {
    case "ENABLE_STREAMING":
      return { ...state, streamingEnabled: action.streamingEnabled };
    case "SET_STREAMING_API_URL":
      return { ...state, apiUrl: action.apiUrl };
    case "ENABLE_STREAMING_API_AUTHENTICATION":
      return { ...state, apiAuthentication: action.apiAuthentication };
    case "SET_STREAMING_API_KEY":
      return { ...state, apiKey: action.apiKey };
    default:
      return state;
  }
}
