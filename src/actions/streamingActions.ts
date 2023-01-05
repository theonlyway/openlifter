import {
  EnableStreaming,
  EnableStreamingApiAuthentication,
  SetStreamingApiKey,
  SetStreamingApiUrl,
} from "../types/actionTypes";

export const enableStreaming = (streamingEnabled: boolean): EnableStreaming => {
  return {
    type: "ENABLE_STREAMING",
    streamingEnabled,
  };
};

export const setStreamingApiUrl = (apiUrl: string): SetStreamingApiUrl => {
  return {
    type: "SET_STREAMING_API_URL",
    apiUrl,
  };
};

export const enableStreamingApiAuthentication = (apiAuthentication: boolean): EnableStreamingApiAuthentication => {
  return {
    type: "ENABLE_STREAMING_API_AUTHENTICATION",
    apiAuthentication,
  };
};

export const setStreamingApiKey = (apiKey: string): SetStreamingApiKey => {
  return {
    type: "SET_STREAMING_API_KEY",
    apiKey,
  };
};
