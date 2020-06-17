import { sagaEvents } from "../constants";
import isEqual from "lodash/isEqual";

export default class StateProxy {
  chartCache: any;
  configuration: object;
  donutRadius?: number;
  sliceCount?: number;
  visualizationType: string;

  constructor() {
    // These are the properties that we will check for updates
    this.chartCache = {
      chartType: null,
      visualizationType: null,
    };

    this.configuration = null;
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
      sliceCount,
    } = state.configuration;

    const hasUpdate = !isEqual(this.chartCache, {
      chartType,
      visualizationType,
      donutRadius,
      sliceCount,
      format,
    });

    if (this.chartCache.donutRadius !== donutRadius && editor.initialized) {
      return true;
    }

    if (this.chartCache.sliceCount !== sliceCount && editor.initialized) {
      return true;
    }

    this.chartCache = { visualizationType, chartType, format, donutRadius, sliceCount };
    return hasUpdate && editor.initialized;
  }

  visualizationTypeChanged(visualizationType): boolean {
    const hasChanged = this.visualizationType !== visualizationType;

    if (hasChanged) {
      this.visualizationType = visualizationType;
    }

    return hasChanged;
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
    const { configuration } = state;
    const hasUpdates = !isEqual(this.configuration, configuration) && this.configuration !== null;
    this.configuration = configuration;
    return hasUpdates;
  }

  // -- This method checks our conditions and returns a saga event
  // -- for any update we want to perform
  async sync(editorState: any) {
    const UPDATES = [];
    if (this.configurationHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE);
    }
    if (
      this.visualizationTypeChanged(editorState.configuration.visualizationType) ||
      this.chartHasUpdate(editorState)) {
      UPDATES.push(sagaEvents.DATA_FLOW_UPDATE_WIDGET);
    }
    return UPDATES;
  }
}
