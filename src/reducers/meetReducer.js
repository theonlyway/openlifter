// vim: set ts=2 sts=2 sw=3 et:

const initialState = {
  name: "",
  formula: "Wilks",
  federation: "",
  date: new Date(),
  dateString: getDateString(new Date())
};

function getDateString(dateTime) {
  return [dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()].join("/");
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_MEET_NAME":
      return { ...state, name: action.name };
    case "SET_FORMULA":
      return { ...state, formula: action.formula };
    case "SET_FEDERATION":
      return { ...state, federation: action.federation };
    case "SET_MEET_DATE":
      return { ...state, date: action.date, dateString: getDateString(action.date) };
    default:
      return state;
  }
};
