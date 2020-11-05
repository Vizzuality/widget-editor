import { createSelector } from "reselect";

import { selectDisabledFeatures, selectColumnOptions } from "../editor/selectors";

const selectAvailableCharts = state => state.configuration.availableCharts;
const selectRasterOnly = state => state.configuration.rasterOnly;
export const selectTitle = state => state.configuration.title;
export const selectDescription = state => state.configuration.description;
export const selectVisualizationType = state => state.configuration.visualizationType;
export const selectLimit = state => state.configuration.limit;
export const selectValue = state => state.configuration.value;
export const selectCategory = state => state.configuration.category;
export const selectColor = state => state.configuration.color;
export const selectSize = state => state.configuration.size;
export const selectOrderBy = state => state.configuration.orderBy;
export const selectAggregateFunction = state => state.configuration.aggregateFunction;
export const selectChartType = state => state.configuration.chartType;
export const selectFilters = state => state.configuration.filters;
export const selectBand = state => state.configuration.band;
export const selectDonutRadius = state => state.configuration.donutRadius;
export const selectSliceCount = state => state.configuration.sliceCount;
export const selectLayer = state => state.configuration.layer;
export const selectCaption = state => state.configuration.caption;

export const selectChartOptions = createSelector(
  [selectAvailableCharts, selectRasterOnly, selectDisabledFeatures],
  (availableCharts, isRaster, disabledFeatures) => {
    let res = availableCharts;

    if (isRaster) {
      // Currently, only map widgets can be created with raster datasets
      res = res.filter(option => option.value === 'map');
    }

    // We filter out the visualization that are disabled by the host app
    res = res.filter(option => disabledFeatures.indexOf(option.value) === -1);

    return res;
  },
);

export const isMap = createSelector(
  [selectChartType],
  chartType => chartType === 'map',
);


export const selectSelectedColorOption = createSelector(
  [selectChartType, selectCategory, selectColor, selectColumnOptions],
  (chartType, category, color, columnOptions) => {
    if (chartType === "pie") {
      const colorColumn = category?.name
        ? columnOptions.find(column => column.value === category.name)
        : null;

      return colorColumn;
    }

    const colorColumn = color?.name
      ? columnOptions.find(column => column.value === color.name)
      : null;

    return  colorColumn ?? {
      label: "Single color",
      value: "_single_color",
    };
  }
);