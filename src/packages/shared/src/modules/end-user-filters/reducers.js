import * as actions from "./actions";

export default {
  [actions.setEndUserFilters]: (state, { payload }) => [...payload],
};
