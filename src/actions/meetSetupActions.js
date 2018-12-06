// vim: set ts=2 sts=2 sw=2 et:

export const setMeetName = name => {
  return {
    type: "SET_MEET_NAME",
    name
  };
};

export const setFormula = formula => {
  return {
    type: "SET_FORMULA",
    formula
  };
};

export const setFederation = federation => {
  return {
    type: "SET_FEDERATION",
    federation
  };
};

export const setMeetDate = date => {
  return {
    type: "SET_MEET_DATE",
    date
  };
};
