import * as actions from "./actions";

import initialState from './initial-state';

export default {
  [actions.resetConfiguration]: (state) => ({ ...initialState }),
  [actions.setConfiguration]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [actions.patchConfiguration]: (state, { payload }) => {
    const otherParams = {};

    // If the user is setting the visualisation to be a map, we set some of its default parameters
    if (payload?.visualizationType === 'map') {
      otherParams.map = {
        ...state.map,
        basemap: {
          ...(state.map.basemap ?? {}),
          basemap: state.map.basemap?.basemap ?? 'dark',
          labels: state.map.basemap?.labels ?? 'none',
          boundaries: state.map.basemap?.boundaries ?? false,
        },
      };
    }

    return {
      ...state,
      ...payload,
      ...otherParams,
    };
  },
};
