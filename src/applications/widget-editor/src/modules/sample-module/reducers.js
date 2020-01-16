import * as actions from "./actions";

export default {
  [actions.sampleAction]: (state, { payload }) => ({
    ...state,
    ...payload
  })
};
