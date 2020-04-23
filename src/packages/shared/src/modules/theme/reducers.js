import * as actions from "./actions";

export default {
  [actions.setTheme]: (state, { payload }) => {
    return { ...state, ...payload };
  },
  [actions.setScheme]: (state, { payload }) => {
    return {
      ...state,
      schemes: [
        ...state.schemes,
        ...(typeof payload === "object" ? payload : {}),
      ],
    };
  },
};
