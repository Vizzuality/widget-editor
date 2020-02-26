import * as actions from "./actions";

export default {
  [actions.setAuthToken]: (state, { payload }) => ({
    ...state,
    authToken: payload
  }),
  [actions.setDataset]: (state, { payload }) => ({
    ...state,
    dataset: payload
  })
};
