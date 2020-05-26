import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetConfiguration]: (state) => ({ ...initialState }),
  [actions.setConfiguration]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [actions.patchConfiguration]: (state, { payload }) => ({
    ...state,
    ...payload
  })
};
