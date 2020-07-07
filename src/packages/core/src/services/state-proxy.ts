import { sagaEvents } from "../constants";
import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import isEqual from "lodash/isEqual";

export default class StateProxy {
  chartCache: any;
  configuration: any;
  donutRadius?: number;
  sliceCount?: number;
  visualizationType: string;
  widget: any;

  constructor() {
    // These are the properties that we will check for updates
    this.chartCache = {
      chartType: null,
      visualizationType: null,
    };

    this.widget = null;

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


    if (this.configuration && !isEqual(this.configuration.orderBy, editor.configuration.orderBy)) {
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

    // XXX: This is simlified in another pr and less greedy
    const hasUpdates = !isEqual(this.configuration, configuration) && this.configuration !== null;

    // Did limit update?
    if (this.configuration && this.configuration.limit !== configuration.limit) {
      return true;
    }

    if (this.configuration && !isEqual(this.configuration.orderBy, configuration.orderBy)) {
      return true;
    }

    this.configuration = configuration;

    return hasUpdates;
  }

  widgetUpToDate(editorState: any) {
    // XXX: for now we only care about the legend
    return isEqual(editorState.widget?.legend, this.widget?.legend);
  }

  // -- This method checks our conditions and returns a saga event
  // -- for any update we want to perform
  async sync(editorState: any, actionName: string) {
    const UPDATES = [];

    // As WIDGET/setWidget is the end result of the state proxy
    // if widget is equal simply exit the loop
    if (actionName === getAction('WIDGET/setWidget') && this.widgetUpToDate(editorState)) {
      return [];
    } else {
      this.widget = editorState.widget;
    }

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
