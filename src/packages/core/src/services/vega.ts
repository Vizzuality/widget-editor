import isObjectLike from "lodash/isObjectLike";

import { Charts, Vega, Widget } from "@widget-editor/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import GroupedBars from "../charts/bars-grouped";
import BarsStacked from "../charts/bars-stacked";
import BarsHorizontal from "../charts/bars-horizontal";
import GroupedBarsHorizontal from "../charts/bars-grouped-horizontal";
import BarsStackedHorizontal from "../charts/bars-stacked-horizontal";
import Line from "../charts/line";
import MultiLine from "../charts/line-multi";
import Scatter from "../charts/scatter";

import { SUPPORTED_CHARTS } from "../charts/constants";
import { defaultVegaSchema } from "../helpers/wiget-helper/constants";

export default class VegaService implements Charts.Service {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  editor: any;
  sliceCount: number;
  scheme: Widget.Scheme;
  schema: Vega.Schema;
  colorApplied: boolean;

  constructor(
    widgetConfig: any,
    widgetData: any,
    configuration: any,
    editor: any,
    scheme: Widget.Scheme
  ) {
    this.colorApplied = isObjectLike(configuration.color);

    this.scheme = scheme;
    this.schema = defaultVegaSchema();
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.configuration = configuration;
    this.editor = editor;
  }

  async resolveChart() {
    const { chartType, direction } = this.configuration;
    let chart;

    const data = this.widgetData;

    if (SUPPORTED_CHARTS.indexOf(chartType) === -1) {
      throw new Error(
        `Chart of type: ${chartType} is not supported. we support: (${SUPPORTED_CHARTS.join(
          "|"
        )})`
      );
    }

    if (chartType === "pie" || chartType === "donut") {
      chart = await new Pie(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme
      ).getChart();
    }

    if (chartType === "bar-horizontal") {
      if (this.configuration.color?.identifier) {
        chart = await new GroupedBarsHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = await new BarsHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme
        ).getChart();
      }
    }

    if (chartType === "stacked-bar-horizontal") {
      if (this.configuration.color?.identifier) {
        chart = await new BarsStackedHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = await new BarsHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme
        ).getChart();
      }
    }

    if (chartType === "bar") {
      if (this.configuration.color?.identifier) {
        chart = await new GroupedBars(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = await new Bars(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme
        ).getChart();
      }
    }

    if (chartType === "stacked-bar") {
      if (this.configuration.color?.identifier) {
        chart = await new BarsStacked(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = await new Bars(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme
        ).getChart();
      }
    }

    if (chartType === "line") {
      if (this.configuration.color?.identifier) {
        chart = await new MultiLine(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = await new Line(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme
        ).getChart();
      }
    }

    if (chartType === "scatter") {
      chart = await new Scatter(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.configuration.color?.identifier
      ).getChart();
    }

    this.schema = {
      ...this.schema,
      ...chart,
    };
  }

  setConfig() {
    this.schema = {
      ...this.schema,
      config: {
        ...this.schema.config,
        ...this.widgetConfig.config,
      },
    };
  }

  async getChart() {
    this.setConfig();
    await this.resolveChart();
    return this.schema;
  }
}
