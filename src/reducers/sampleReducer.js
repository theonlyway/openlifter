// A reducer describes how the application state is going to change with respect to actions dispatched to the redux store
export default (state = {}, action) => {
  switch (action.type) {
    case "SAMPLE_ACTION":
      return {
        result: action.payload
      };
    default:
      return state;
  }
};
