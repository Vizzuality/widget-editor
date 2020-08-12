import { createAction } from "helpers/redux";

export const setWidgetConfig = createAction("WIDGETCONFIG/setWidgetConfig");
export const resetWidgetConfig = createAction("WIDGETCONFIG/resetWidgetConfig");

export default {
  setWidgetConfig,
  resetWidgetConfig
};
