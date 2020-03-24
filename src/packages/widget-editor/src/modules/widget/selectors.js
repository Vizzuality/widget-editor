import { createSelector } from "reselect";

const getConfiguration = state => state.configuration;
const getDataset = state => state.editor.dataset;

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
      identifier: configuration.value.name
    };
  }
);

export const getWidgetColumns = createSelector([getDataset], dataset => {
  if (
    !dataset ||
    !dataset.id ||
    !dataset.attributes ||
    !dataset.attributes.widgetRelevantProps
  ) {
    return [];
  }

  const columns = dataset.attributes.widgetRelevantProps.map(prop => ({
    ...dataset.attributes.metadata[0].attributes.columns[prop],
    identifier: prop,
    name: prop
  }));

  return columns;
});
