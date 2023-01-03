import { StreamingState } from "../types/stateTypes";
import { EnableStreaming } from "../types/actionTypes";

type Action = EnableStreaming;

const initialState: StreamingState = {
  enabled: false,
};

export default function streamingReducer(state: StreamingState = initialState, action: Action) {
  switch (action.type) {
    case "ENABLE_STREAMING":
      return { ...state, enabled: action.enabled };
    default:
      return state;
  }
}
