import * as actions from "./actions";

export default {
  [actions.setFilters]: (state, { payload }) => ({ ...state, ...payload })
};
