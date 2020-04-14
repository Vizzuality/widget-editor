import * as actions from "./actions";
export default {
  [actions.setWidget]: (state, {
    payload
  }) => ({ ...state,
    ...payload
  })
};