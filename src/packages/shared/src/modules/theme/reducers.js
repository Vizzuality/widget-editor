import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetTheme]: () => ({ ...initialState }),
  [actions.setTheme]: (state, { payload }) => {
    return { ...state, ...payload };
  },
  [actions.setSchemes]: (state, { payload }) => {
    const activeScheme = payload.find(scheme => scheme.name === state.selectedScheme);
    
    return {
      ...state,
      selectedScheme: !activeScheme ? payload[0].name : state.selectedScheme,
      schemes: payload,
    };
  },
  [actions.setSelectedScheme]: (state, { payload }) => ({
    ...state,
    selectedScheme: payload,
  })
};
