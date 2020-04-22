import { sagaEvents } from "../constants";
import isEqual from "lodash/isEqual";

export default class StateProxy {
  chartCache: any;
  configuration: object;
  donutRadius?: number;
  slizeCount?: number;

  constructor() {
    // These are the properties that we will check for updates
    this.chartCache = {
      chartType: null,
      direction: null,
    };

    this.configuration = {
      value: null,
      format: null,
      category: null,
      donutRadius: null,
      orderBy: null,
      groupBy: null,
      color: null,
      aggregateFunction: null,
      filters: null,
      areaIntersection: null,
      band: null,
      layer: null,
      limit: null,
    };
  }

  cacheChart(state) {
    const { chartType = null, direction = null } = state.configuration;
    this.chartCache = { chartType, direction };
  }

  chartHasUpdate(state) {
    const { editor } = state;
    const {
      chartType,
      direction,
      format,
      donutRadius,
      slizeCount,
    } = state.configuration;

    const hasUpdate = !isEqual(this.chartCache, {
      chartType,
      donutRadius,
      slizeCount,
      direction,
      format,
    });

    if (this.chartCache.donutRadius !== donutRadius && editor.initialized) {
      return true;
    }

    if (this.chartCache.slizeCount !== slizeCount && editor.initialized) {
      return true;
    }

    this.chartCache = { chartType, direction, format, donutRadius, slizeCount };
    return hasUpdate && editor.initialized;
  }

  configurationHasUpdate(state) {
    const { editor } = state;
    const {
      value,
      category,
      orderBy,
      groupBy,
      format,
      color,
      aggregateFunction,
      filters,
      areaIntersection,
      band,
      layer,
      limit,
    } = state.configuration;

    const updatedConfiguration = {
      value,
      category,
      orderBy,
      groupBy,
      format,
      color,
      aggregateFunction,
      filters,
      areaIntersection,
      band,
      layer,
      limit,
    };

    const hasUpdate = !isEqual(this.configuration, updatedConfiguration);
    this.configuration = updatedConfiguration;

    return hasUpdate && editor.initialized;
  }

  // -- This method checks our conditions and returns a saga event
  // -- for any update we want to perform
  async sync(editorState: object) {
    const UPDATES = [];

    if (this.chartHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_UPDATE_WIDGET);
    }

    if (this.configurationHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE);
    }

    return UPDATES;
  }
}
