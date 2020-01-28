import { createSelector } from "reselect";

const getConfiguration = state => state.configuration;
const getDataset = state => state.editor.dataset;

export const getWidgetSelectedColumn = createSelector(
  [getConfiguration, getDataset],
  (configuration, dataset) => {
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
  // TODO: Lots of assumptions here
  // 1. Do we always have dataset metadata?
  // 2. Is it always on index:0 ?
  // 3. Do we always have relevant props ?
  const columns = dataset.attributes.widgetRelevantProps.map(prop => ({
    ...dataset.attributes.metadata[0].attributes.columns[prop],
    identifier: prop
  }));

  return columns;
});
