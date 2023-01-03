import { EnableStreaming } from "../types/actionTypes";

export const enableStreaming = (enabled: boolean): EnableStreaming => {
  return {
    type: "ENABLE_STREAMING",
    enabled,
  };
};
