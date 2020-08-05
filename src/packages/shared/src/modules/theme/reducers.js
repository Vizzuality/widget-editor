import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetTheme]: () => ({ ...initialState }),
  [actions.setTheme]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [actions.setSchemes]: (state, { payload }) => ({
    ...state,
    schemes: payload,
  }),
  [actions.setSelectedScheme]: (state, { payload }) => ({
    ...state,
    selectedScheme: payload,
  })
};
