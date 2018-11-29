// vim: set ts=2 sts=2 sw=2 et:

export const changeLanguage = lang => {
  return {
    type: "CHANGE_LANGUAGE",
    payload: lang
  };
};
