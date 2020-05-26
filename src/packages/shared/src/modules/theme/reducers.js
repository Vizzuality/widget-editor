import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetTheme]: () => ({ ...initialState }),
  [actions.setTheme]: (state, { payload }) => {
    return { ...state, ...payload };
  },
  [actions.setScheme]: (state, { payload }) => {
    let selectedScheme = payload.find(
      (scheme) => scheme.name === state.selectedScheme
    );

    if (!selectedScheme) {
      selectedScheme = payload[0].name;
    } else {
      selectedScheme = selectedScheme.name;
    }

    return {
      ...state,
      selectedScheme,
      schemes: payload,
    };
  },
};
