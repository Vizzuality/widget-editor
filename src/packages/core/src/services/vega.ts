import { Charts, Vega } from '@packages/types';

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import Line from "../charts/line";
import Scatter from "../charts/scatter";

import { SUPPORTED_CHARTS } from "../charts/constants";

import {
  defaultVegaSchema,
  sqlFields
} from "../helpers/wiget-helper/constants";

export default class VegaService implements Charts.Service {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  scheme: any;
  schema: Vega.Schema;

  constructor(widgetConfig: any, widgetData: any, configuration: any, theme: any) {
    this.scheme = theme.schemes.find(scheme => scheme.name === theme.selectedScheme);
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
        this.widgetData,
        this.scheme
      ).getChart();
    }

    if (chartType === "bar") {
      chart = new Bars(
        this.schema,
        this.widgetConfig,
        this.widgetData,
        this.scheme
      ).getChart();
    }

    if (chartType === "line") {
      chart = new Line(
        this.schema,
        this.widgetConfig,
        this.widgetData,
        this.scheme
      ).getChart();
    }

    if (chartType === "scatter") {
      chart = new Scatter(
        this.schema,
        this.widgetConfig,
        this.widgetData,
        this.scheme
      ).getChart();
    }

    this.schema = {
      ...this.schema,
      ...chart
    };
  }

  setConfig() {
    // TODO: Support default config if none is present
    this.schema = { ...this.schema, config: { ...this.schema.config, ...this.widgetConfig.config } };
  }

  getChart() {
    return this.schema;
  }
}
