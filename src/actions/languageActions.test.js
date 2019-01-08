// vim: set ts=2 sts=2 sw=2 et:

import * as actions from "./languageActions";

describe("actions", () => {
  it("should create a change language action", () => {
    const text = "eo";
    const expectedAction = {
      type: "CHANGE_LANGUAGE",
      language: text
    };
    expect(actions.changeLanguage(text)).toEqual(expectedAction);
  });
});
