import * as actions from "./actions";

export default {
  [actions.resetWidget]: () => null,
  [actions.setWidget]: (state, { payload }) => ({ ...state, ...payload })
};
