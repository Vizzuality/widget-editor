import * as actions from "./actions";

export default {
  [actions.modifyOptions]: (state, { payload }) => ({
    ...state,
    ...payload
  })
};
