import FiltersService from "./filters";
import { sagaEvents } from "../constants";
import isEqual from "lodash/isEqual";

export default class StateProxy {
  cache: object;
  constructor() {
    // These are the properties that we will check for updates
    this.cache = {
      limit: null,
      chartType: null,
      value: null,
      orderBy: null
    };
  }

  checkHasUpdate(state: { limit: number; chartType: number; value: object }) {
    const keys = Object.keys(this.cache);
    let hasUpdate = false;
    keys.forEach(key => {
      hasUpdate = hasUpdate || !isEqual(this.cache[key], state[key]);
    });

    return hasUpdate;
  }

  cacheCurrent(state: { limit: number; chartType: number; value: object }) {
    this.cache = state;
  }

  async sync(state: { limit: number; chartType: number; value: object }, datasetId: string) {
    const hasUpdate = this.checkHasUpdate(state);

    if (hasUpdate) {
      this.cacheCurrent(state);
      const filtersService = new FiltersService(state, datasetId);
      const widgetData = await filtersService.requestWidgetData();
      return {
        hasUpdates: hasUpdate,
        widgetData: widgetData.data
      };
    }

    return {
      hasUpdates: hasUpdate,
      widgetData: null
    };
  }
}
