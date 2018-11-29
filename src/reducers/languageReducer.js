// vim: set ts=2 sts=2 sw=2 et:

const initialState = {
  lang: "en"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      return {
        ...state,
        lang: action.payload
      };
    default:
      return state;
  }
};
