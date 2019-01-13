// vim: set ts=2 sts=2 sw=2 et:
// @flow

export type ChangeLanguageAction = { +type: "CHANGE_LANGUAGE", +language: string };

export const changeLanguage = (lang: string): ChangeLanguageAction => {
  return {
    type: "CHANGE_LANGUAGE",
    language: lang
  };
};
