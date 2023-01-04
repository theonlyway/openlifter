import {
  EnableDatabaseAuthentication,
  EnableStreaming,
  SetStreamingDatabaseAddress,
  SetStreamingDatabasePassword,
  SetStreamingDatabasePort,
  SetStreamingDatabaseType,
  SetStreamingDatabaseUsername,
} from "../types/actionTypes";

export const enableStreaming = (streamingEnabled: boolean): EnableStreaming => {
  return {
    type: "ENABLE_STREAMING",
    streamingEnabled,
  };
};

export const setStreamingDatabaseType = (databaseType: string): SetStreamingDatabaseType => {
  return {
    type: "SET_STREAMING_DATABASE_TYPE",
    databaseType,
  };
};

export const setStreamingDatabaseAddress = (databaseAddress: string): SetStreamingDatabaseAddress => {
  return {
    type: "SET_STREAMING_DATABASE_ADDRESS",
    databaseAddress,
  };
};

export const setStreamingDatabasePort = (databasePort: string): SetStreamingDatabasePort => {
  return {
    type: "SET_STREAMING_DATABASE_PORT",
    databasePort,
  };
};

export const enableDatabaseAuthentication = (databaseAuthentication: boolean): EnableDatabaseAuthentication => {
  return {
    type: "ENABLE_DATABASE_AUTHENTICATION",
    databaseAuthentication,
  };
};

export const setStreamingDatabaseUsername = (databaseUsername: string): SetStreamingDatabaseUsername => {
  return {
    type: "SET_STREAMING_DATABASE_USERNAME",
    databaseUsername,
  };
};

export const setStreamingDatabasePassword = (databasePassword: string): SetStreamingDatabasePassword => {
  return {
    type: "SET_STREAMING_DATABASE_PASSWORD",
    databasePassword,
  };
};
