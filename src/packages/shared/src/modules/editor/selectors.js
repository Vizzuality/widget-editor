import { createSelector } from 'reselect';

import { getLocalCache } from '@widget-editor/widget-editor/lib/exposed-hooks';

export const selectDisabledFeatures = state => state.editor.disabledFeatures;
export const selectAdvanced = state => state.editor.advanced;
export const selectWidget = state => state.editor.widget;
export const selectZoom = state => state.editor.map?.zoom ?? null;
export const selectLat = state => state.editor.map?.lat ?? null;
export const selectLng = state => state.editor.map?.lng ?? null;
export const selectBounds = state => state.editor.map?.bounds ?? null;
export const selectBbox = state => state.editor.map?.bbox ?? null;
export const selectBasemap = state => state.editor.map?.basemap
  ? {
    basemap: state.editor.map.basemap.basemap,
    labels: state.editor.map.basemap.labels || null,
    boundaries: state.editor.map.basemap.boundaries || false,
  }
  : null;
export const selectFields = state => state.editor.fields;

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
