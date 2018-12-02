// vim: set ts=2 sts=2 sw=2 et:

export const setMeetName = name => {
  return {
    type: "SET_MEET_NAME",
    payload: name
  };
};

export const setFormula = formula => {
  return {
    type: "SET_FORMULA",
    payload: formula
  };
};
