import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetEditor]: () => ({ ...initialState }),
  [actions.editorSyncMap]: (state, { payload }) => ({ ...state, map: payload }),
  [actions.setEditor]: (state, { payload }) => ({ ...state, ...payload })
};
