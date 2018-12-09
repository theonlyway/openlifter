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

export const setLengthDays = length => {
  return {
    type: "SET_LENGTH_DAYS",
    length
  };
};

export const setPlatformsOnDays = data => {
  return {
    type: "SET_PLATFORM_COUNT",
    data
  };
};

export const setInKg = inKg => {
  return {
    type: "SET_IN_KG",
    inKg
  };
};
