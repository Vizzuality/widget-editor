import FiltersService from "./filters";
import { sagaEvents } from "../constants";
import isEqual from "lodash/isEqual";
let cacheState = {
  limit: null,
  chartType: null,
  value: null
};

const cache = state => {
  cacheState = state;
};

const sync = async (state: {
  limit: number;
  chartType: string;
  value: object;
}) => {
  const hasUpdates =
    (!!cacheState.limit && cacheState.limit !== state.limit) ||
    (!!cacheState.chartType && cacheState.chartType !== state.chartType) ||
    (!!cacheState.value && !isEqual(cacheState.value, state.value));

  // We dont have any state to compare with
  // so we can treat it as "initial state"
  // Construct correct SQL query based on widgetConfig
  if (hasUpdates) {
    cache(state);
    const filtersService = new FiltersService(state);
    const widgetData = await filtersService.requestWidgetData();
    return {
      hasUpdates,
      widgetData: widgetData.data
    };
  }

  return {
    hasUpdates,
    widgetData: null
  };
};

export default {
  cache,
  sync
};
