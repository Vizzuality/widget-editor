import * as actions from "./actions";

export default {
  [actions.setConfiguration]: (state, { payload }) => ({ ...state, ...payload })
};
