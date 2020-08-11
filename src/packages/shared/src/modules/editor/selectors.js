import { createSelector } from "reselect";

import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks"

const selectWidget = state => state.editor.widget;
export const selectDisabledFeatures = state => state.editor.disabledFeatures;

export const selectWidgetConfig = createSelector(
  [selectWidget],
  widget => widget ? widget.attributes.widgetConfig : null
);

export const selectWidgetScheme = createSelector(
  [selectWidgetConfig],
  widgetConfig => widgetConfig?.config
    ? getLocalCache().adapter.getDeserializedScheme(widgetConfig.config)
    : null
);
