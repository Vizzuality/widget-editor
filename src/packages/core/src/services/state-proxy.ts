import FiltersService from "./filters";
import { sagaEvents } from "../constants";

let cacheState = null;

const cache = state => {
  cacheState = state;
};

const sync = async (state: object) => {
  const hasUpdates = cacheState.limit !== state.limit;

  // We dont have any state to compare with
  // so we can treat it as "initial state"
  // Construct correct SQL query based on widgetConfig
  if (hasUpdates) {
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
