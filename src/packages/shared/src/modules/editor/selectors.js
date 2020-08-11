import { createSelector } from 'reselect';

import { getLocalCache } from '@widget-editor/widget-editor/lib/exposed-hooks';

export const selectDisabledFeatures = state => state.editor.disabledFeatures;
export const selectAdvanced = state => state.editor.advanced;
export const selectWidget = state => state.editor.widget;

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

export const selectIsEditing = createSelector(
  [selectWidget],
  widget => !!widget,
);

export const selectIsWidgetAdvanced = createSelector(
  [selectWidget],
  widget => !!widget && !widget?.attributes?.widgetConfig?.paramsConfig,
);
