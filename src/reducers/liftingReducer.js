// vim: set ts=2 sts=2 sw=2 et:
//
// This file contains the main application logic.
//
// Because OpenLifter is built with Redux, visual components on the lifting page
// must reflect global state, and the "application logic" that determines behavior
// when an action occurs must be a pure function that accepts an existing state
// (of the meet) and produces the next state (of the meet).
//

const initialState = {

};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
