// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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

export const setBarAndCollarsWeightKg = weightKg => {
  return {
    type: "SET_BAR_AND_COLLARS_WEIGHT_KG",
    weightKg: weightKg
  };
};

export const setPlatesOnSide = (weightKg, amount) => {
  return {
    type: "SET_PLATES_ON_SIDE",
    weightKg,
    amount
  };
};
