import { createSelector } from "reselect";

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

    let columns;
    const relevantProps = dataset.attributes.widgetRelevantProps;
    const datasetMeta = dataset.attributes.metadata[0];
    if (!relevantProps || relevantProps.length === 0) {
      if (datasetMeta.attributes.columns) {
        columns = Object.keys(datasetMeta.attributes.columns).map((prop) => ({
          ...datasetMeta.attributes.columns[prop],
          identifier: prop,
          name: prop,
          type: getColumnDataType(prop, fields),
        }));
      } else {
        columns = (fields || []).map(field => ({
          identifier: field.columnName,
          name: field.columnName,
          type: getColumnDataType(field.columnName, fields),
        }));
      }
    } else {
      columns = relevantProps.map((prop) => ({
        ...datasetMeta.attributes.columns[prop],
        identifier: prop,
        name: prop,
        type: getColumnDataType(prop, fields),
      }));
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
