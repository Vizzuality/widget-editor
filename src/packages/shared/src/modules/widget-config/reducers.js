import * as actions from "./actions";

export default {
  [actions.resetWidgetConfig]: () => null,
  [actions.setWidgetConfig]: (state, { payload }) => ({ ...payload })
};
