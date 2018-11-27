// An action is basically a javascript object that contains info to send to the store
export const sampleAction = text => {
  return {
    // An action must have a unique type
    type: "SAMPLE_ACTION",
    // An action must have a payload
    payload: text
  };
};
