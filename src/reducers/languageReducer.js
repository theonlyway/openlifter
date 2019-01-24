// vim: set ts=2 sts=2 sw=2 et:
// @flow

import type { ChangeLanguageAction } from "../actions/languageActions";

export type LanguageState = string;

type OverwriteStoreAction = {
  +type: "OVERWRITE_STORE",
  +store: {
    +language: string
  }
};

type Action = ChangeLanguageAction | OverwriteStoreAction;

export default (state: LanguageState = "en", action: Action): LanguageState => {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      return action.language;

    case "OVERWRITE_STORE":
      return action.store.language;

    default:
      (action.type: empty); // eslint-disable-line
      return state;
  }
};
