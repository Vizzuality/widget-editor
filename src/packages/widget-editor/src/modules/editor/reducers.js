import * as actions from "./actions";

export default {
  [actions.setEditor]: (state, { payload }) => ({ ...state, ...payload })
};
