// vim: set ts=2 sts=2 sw=2 et:

export default (state = "en", action) => {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      return action.payload;

    case "OVERWRITE_STORE":
      return action.store.language;

    default:
      return state;
  }
};
