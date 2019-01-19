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

export const setDivisions = divisions => {
  return {
    type: "SET_DIVISIONS",
    divisions
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

export const setPlatformsOnDays = (day, count) => {
  return {
    type: "SET_PLATFORM_COUNT",
    day: day,
    count: count
  };
};

export const setInKg = inKg => {
  return {
    type: "SET_IN_KG",
    inKg
  };
};

export const setWeightClasses = (sex, classesKg) => {
  return {
    type: "SET_WEIGHTCLASSES",
    sex: sex,
    classesKg: classesKg
  };
};

export const setAreWrapsRaw = areWrapsRaw => {
  return {
    type: "SET_ARE_WRAPS_RAW",
    areWrapsRaw
  };
};

export const setMeetCountry = country => {
  return {
    type: "SET_MEET_COUNTRY",
    country
  };
};

export const setMeetState = state => {
  return {
    type: "SET_MEET_STATE",
    state
  };
};

export const setMeetCity = city => {
  return {
    type: "SET_MEET_CITY",
    city
  };
};

export const setPlatesOnSide = (weightKg, amount) => {
  return {
    type: "SET_PLATES_ON_SIDE",
    weightKg,
    amount
  };
};
