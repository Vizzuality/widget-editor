import { createSelector } from 'reselect';

import { getDeserializedScheme } from '@widget-editor/core';

export const selectDisabledFeatures = state => state.editor.disabledFeatures;
export const selectAdvanced = state => state.editor.advanced;
export const selectDataset = state => state.editor.dataset;
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
export const selectWidgetData = state => state.editor.widgetData;
export const selectTableData = state => state.editor.tableData;

export const selectDatasetIsRaster = createSelector(
  [selectDataset],
  dataset => dataset?.type === 'raster'
);

export const selectColumnOptions = createSelector(
  [selectFields],
  (fields) => {
    if (!fields?.length) {
      return [];
    }

    return fields.map(field => {
      const alias = field.metadata?.alias;
      const description = field.metadata?.description;

      const label = alias || field.columnName;
      const value = field.columnName;
      const type = field.type;

      return { label, value, type, description };
    }).sort((option1, option2) => option1.label.localeCompare(option2.label));
  }
);

export const selectWidgetConfig = createSelector(
  [selectWidget],
  widget => widget ? widget.widgetConfig : null
);

export const selectWidgetScheme = createSelector(
  [selectWidgetConfig],
  widgetConfig => widgetConfig?.config
    ? getDeserializedScheme(widgetConfig.config)
    : null
);

export const selectIsEditing = createSelector(
  [selectWidget],
  widget => !!widget,
);

export const selectIsWidgetAdvanced = createSelector(
  [selectWidget],
  widget => !!widget && !widget?.widgetConfig?.paramsConfig,
);

export const selectHasGeoInfo = createSelector(
  [selectDataset],
  dataset => !!dataset && dataset.geoInfo,  
);
