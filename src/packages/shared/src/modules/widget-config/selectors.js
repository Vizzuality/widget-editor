import { createSelector } from "reselect";

import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks";
import { selectIsWidgetAdvanced } from "@widget-editor/shared/lib/modules/editor/selectors";
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";

const SINGLE_COLOR_OPTION = {
  alias: "Single color",
  name: "Single color",
  identifier: "___single_color",
};

const getColumnDataType = (columnName, fields) => {
  let o = null;

  if (!fields) {
    return null;
  }

  fields.forEach((field) => {
    if (field.columnName === columnName) {
      o = field.type;
    }
  });
  return o;
};

export const selectWidgetConfig = state => state.widgetConfig;
const getConfiguration = (state) => state.configuration;
const getDataset = (state) => state.editor.dataset;
const getFilters = (state) => state.filters;
const getFields = (state) => state.editor.fields;

const getProps = (_, props) => (props ? props : null);

export const getWidgetSelectedColumn = createSelector(
  [getConfiguration, getDataset],
  (configuration, dataset) => {
    if (
      !dataset ||
      !dataset.id ||
      !dataset.attributes ||
      !dataset.attributes.metadata
    ) {
      return null;
    }

    const value =
      dataset.attributes.metadata[0].attributes.columns[
        configuration.value.name
      ];
    return {
      ...value,
      identifier: configuration.value.name,
    };
  }
);

export const getWidgetColumns = createSelector(
  [getConfiguration, getDataset, getFields, getProps],
  (configuration, dataset, fields, props) => {
    if (
      !dataset ||
      !dataset.hasOwnProperty("id") ||
      !dataset.hasOwnProperty("attributes") ||
      !dataset.attributes.hasOwnProperty("widgetRelevantProps")
    ) {
      return [];
    }

    const relevantProps = dataset.attributes.widgetRelevantProps;
    const datasetMeta = dataset.attributes.metadata?.[0];

    let columns = [];
    if (fields) {
      columns = fields.map(field => ({
        ...(datasetMeta?.attributes.columns?.[field.columnName] ?? {}),
        identifier: field.columnName,
        name: field.columnName,
        type: getColumnDataType(field.columnName, fields),
      }));

      if (relevantProps?.length > 0) {
        columns = columns.filter(column => relevantProps.indexOf(column.name) !== -1);
      }
    }

    if (configuration.chartType === "pie") {
      return columns;
    }

    if (props && props.colorDimention === true) {
      return [SINGLE_COLOR_OPTION, ...columns];
    }

    return columns;
  }
);

export const getSelectedColor = createSelector(
  [getConfiguration, getDataset, getWidgetColumns],
  (configuration, dataset, widgetColumns) => {
    if (
      !dataset ||
      !dataset.id ||
      !dataset.attributes ||
      !dataset.attributes.metadata
    ) {
      return null;
    }

    if (configuration.chartType === "pie") {
      const colorColumn = configuration.category?.name
        ? widgetColumns.find(column => column.identifier === configuration.category.name)
        : null;

      return colorColumn || null;
    }

    const colorColumn = configuration.color?.name
      ? widgetColumns.find(column => column.identifier === configuration.color.name)
      : null;

    return  colorColumn || SINGLE_COLOR_OPTION;
  }
);

export const selectSerializedWidgetConfig = createSelector(
  [selectWidgetConfig, selectIsWidgetAdvanced, selectScheme],
  (widgetConfig, isAdvancedWidget, scheme) => {
    const { adapter } = getLocalCache();
    const config = { ...(widgetConfig ?? {}) };

    if (isAdvancedWidget) {
      return config;
    }

    // When the user is creating or editing a widget, the data is embedded within the widgetConfig
    // This function replaces it by the URL of the data
    if (config.data && Array.isArray(config.data)) {
      config.data = config.data.map(data => {
        if (data.name === 'table') {
          return {
            name: 'table',
            transform: data.transform ?? null,
            format: {
              type: 'json',
              property: 'data',
            },
            url: adapter.getDataUrl(),
          };
        }
        return data;
      });
    }

    // We serialise the selected scheme
    config.config = adapter.getSerializedScheme(scheme);

    return config;
  }
);
