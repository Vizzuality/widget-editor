import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetEditor]: () => ({ ...initialState }),
  [actions.setEditor]: (state, { payload }) => ({ ...state, ...payload })
};
