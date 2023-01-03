import { EnableStreaming, SetStreamingDatabaseAddress, SetStreamingDatabaseType } from "../types/actionTypes";

export const enableStreaming = (enabled: boolean): EnableStreaming => {
  return {
    type: "ENABLE_STREAMING",
    enabled,
  };
};

export const setStreamingDatabaseType = (databaseType: string): SetStreamingDatabaseType => {
  return {
    type: "SET_STREAMING_DATABASE_TYPE",
    databaseType,
  };
};

export const setStreamingDatabaseAddress = (address: string): SetStreamingDatabaseAddress => {
  return {
    type: "SET_STREAMING_DATABASE_ADDRESS",
    address,
  };
};
