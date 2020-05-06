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
      visualizationType: null,
    };

    this.configuration = {
      limit: null,
    };
  }

  cacheChart(state) {
    const { chartType = null, visualizationType = null } = state.configuration;
    this.chartCache = { chartType, visualizationType };
  }

  chartHasUpdate(state) {
    const { editor } = state;
    const {
      chartType,
      visualizationType,
      format,
      donutRadius,
      slizeCount,
    } = state.configuration;

    const hasUpdate = !isEqual(this.chartCache, {
      chartType,
      visualizationType,
      donutRadius,
      slizeCount,
      format,
    });

    if (this.chartCache.donutRadius !== donutRadius && editor.initialized) {
      return true;
    }

    if (this.chartCache.slizeCount !== slizeCount && editor.initialized) {
      return true;
    }

    this.chartCache = { chartType, format, donutRadius, slizeCount };
    return hasUpdate && editor.initialized;
  }

  checkProperties(input, compare, props) {
    let updates = false;
    props.forEach((prop) => {
      if (!updates && input[prop] !== compare[prop]) {
        updates = true;
      }
    });
    return updates;
  }

  configurationHasUpdate(state) {
    const { editor, configuration } = state;

    // Whenever one of these properties change in our configuration
    // We need to update data
    const compareProps = [
      "limit",
      "orderBy",
      "groupBy",
      "format",
      "value",
      "category",
      "color",
      "aggregateFunction",
    ];

    const hasUpdates = this.checkProperties(
      configuration,
      this.configuration,
      compareProps
    );

    this.configuration = configuration;
    return hasUpdates;
  }

  // -- This method checks our conditions and returns a saga event
  // -- for any update we want to perform
  async sync(editorState: object) {
    const UPDATES = [];
    if (this.configurationHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE);
    }

    if (this.chartHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_UPDATE_WIDGET);
    }

    return UPDATES;
  }
}
