import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetFilters]: () => ({ ...initialState }),
  [actions.setFilters]: (state, { payload }) => ({ ...state, ...payload })
};
