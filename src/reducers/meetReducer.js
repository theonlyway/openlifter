// vim: set ts=2 sts=2 sw=3 et:

const initialState = {
  name: "",
  formula: "Wilks",
  federation: "",
  date: new Date(),
  dateString: getDateString(new Date()),
  lengthDays: 1,
  platformsOnDays: [1],
  inKg: true
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
    case "SET_LENGTH_DAYS":
      return { ...state, lengthDays: Number(action.length) };
    case "SET_PLATFORM_COUNT": {
      let newPlatformsOnDays = state.platformsOnDays.slice();
      newPlatformsOnDays[action.data.day - 1] = Number(action.data.count);
      return { ...state, platformsOnDays: newPlatformsOnDays };
    }
    case "SET_IN_KG":
      return { ...state, inKg: action.inKg };
    default:
      return state;
  }
};
