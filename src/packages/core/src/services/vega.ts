import isObjectLike from "lodash/isObjectLike";

import { Charts, Vega } from "@widget-editor/types";

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

import {
  defaultVegaSchema,
  sqlFields,
} from "../helpers/wiget-helper/constants";

const DEFAULT_SCHEME = {
  name: "default",
  mainColor: "#3BB2D0",
  category: [
    '#3BB2D0',
    '#2C75B0',
    '#FAB72E',
    '#EF4848',
    '#65B60D',
    '#C32D7B',
    '#F577B9',
    '#5FD2B8',
    '#F1800F',
    '#9F1C00',
    '#A5E9E3',
    '#B9D765',
    '#393F44',
    '#CACCD0',
    '#717171',
  ],
};

export default class VegaService implements Charts.Service {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  editor: any;
  sliceCount: number;
  scheme: any;
  schema: Vega.Schema;
  colorApplied: boolean;

  constructor(
    widgetConfig: any,
    widgetData: any,
    configuration: any,
    editor: any,
    theme: any
  ) {
    if (theme) {
      this.scheme = theme.schemes.find(
        (scheme) => scheme.name === theme.selectedScheme
      );
    } else {
      this.scheme = DEFAULT_SCHEME;
    }

    this.colorApplied = isObjectLike(configuration.color);

    this.schema = defaultVegaSchema();
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.configuration = configuration;
    this.editor = editor;

    this.setConfig();
    this.resolveChart();
  }

  resolveChart() {
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
      chart = new Pie(
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
        chart = new GroupedBarsHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = new BarsHorizontal(
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
        chart = new BarsStackedHorizontal(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = new BarsHorizontal(
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
        chart = new GroupedBars(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = new Bars(
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
        chart = new BarsStacked(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = new Bars(
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
        chart = new MultiLine(
          this.configuration,
          this.editor,
          this.schema,
          this.widgetConfig,
          data,
          this.scheme,
          this.configuration.color.identifier
        ).getChart();
      } else {
        chart = new Line(
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
      chart = new Scatter(
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

  getChart() {
    return this.schema;
  }
}
