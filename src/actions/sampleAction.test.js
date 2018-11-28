import * as actions from "./sampleAction";

describe("actions", () => {
  it("should create a sample action", () => {
    const text = "hello world";
    const expectedAction = {
      type: "SAMPLE_ACTION",
      payload: text
    };
    expect(actions.sampleAction(text)).toEqual(expectedAction);
  });
});
