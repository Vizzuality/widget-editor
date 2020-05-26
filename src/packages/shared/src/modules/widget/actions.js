import { createAction } from "helpers/redux";

export const setWidget = createAction("WIDGET/setWidget");
export const resetWidget = createAction("WIDGET/resetWidget");

export default {
  setWidget,
  resetWidget
};
