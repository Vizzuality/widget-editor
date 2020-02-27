import * as actions from "./actions";

export default {
  [actions.setTheme]: (state, { payload }) => {
    return { ...state, ...payload };
  }
};
