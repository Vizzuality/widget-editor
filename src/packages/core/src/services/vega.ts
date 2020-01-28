import { Charts } from "@packages/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";

import { SUPPORTED_CHARTS } from "../charts/constants";

import {
  defaultVegaSchema,
  sqlFields
} from "../helpers/wiget-helper/constants";

export default class Vega implements Charts.Vega {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  schema: any;

  constructor(widgetConfig: any, widgetData: any, configuration: any) {
    this.schema = defaultVegaSchema();

    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.configuration = configuration;

    this.setConfig();
    this.resolveChart();
  }

  resolveChart() {
    const { chartType } = this.configuration;
    let chart;

    if (SUPPORTED_CHARTS.indexOf(chartType) === -1) {
      throw new Error(
        `Chart of type: ${chartType} is not supported. we support: (${SUPPORTED_CHARTS.join(
          "|"
        )})`
      );
    }

    if (chartType === "pie") {
      chart = new Pie(
        this.schema,
        this.widgetConfig,
        this.widgetData
      ).getChart();
    }

    if (chartType === "bars") {
      chart = new Bars(
        this.schema,
        this.widgetConfig,
        this.widgetData
      ).getChart();
    }

    this.schema = {
      ...this.schema,
      ...chart
    };
  }

  setConfig() {
    // TODO: Support default config if none is present
    this.schema = { ...this.schema, config: this.widgetConfig.config };
  }

  getChart() {
    return this.schema;
  }
}
