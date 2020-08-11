import { createSelector } from "reselect";

import { selectDisabledFeatures } from "../editor/selectors";

const selectAvailableCharts = state => state.configuration.availableCharts;
const selectRasterOnly = state => state.configuration.rasterOnly;
const selectChartType = state => state.configuration.chartType;

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