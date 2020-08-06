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
  }),
  [actions.updateScheme]: (state, { payload }) => {
    const scheme = state.schemes.find(s => s.name === state.selectedScheme);
    const newScheme = {
      ...payload,
      // We make sure that if a theme is customized, its name reflects it
      name: 'user-custom',
    };
    const newSchemes = scheme
      ? state.schemes.map(s => s === scheme ? newScheme : s)
      : [...state.schemes, newScheme];

    return {
      ...state,
      // If the host app doesn't support a widget's embedded scheme, it is shown as “Custom” in the
      // UI and the user is given the possibility to edit it
      // As soon as the user modifies it, it's named is updated to `user-custom` so we know it's not
      // an “officially” supported scheme by any host app anymore
      // For this reason, we need to set as selected the `user-custom` scheme
      selectedScheme: 'user-custom',
      schemes: newSchemes,
    };
  },
};
