import isObjectLike from "lodash/isObjectLike";

import { Charts, Vega } from "@widget-editor/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import BarsHorizontal from "../charts/bars-horizontal";
import BarsStacked from "../charts/bars-stacked";
import Line from "../charts/line";
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

    this.sliceCount = configuration?.sliceCount || 5;

    this.setConfig();
    this.resolveChart();
  }

  groupSimilar(data) {
    const combineSimilar = {};

    data.forEach((node) => {
      if (node.x in combineSimilar) {
        combineSimilar[node.x] = {
          ...combineSimilar[node.x],
          y: combineSimilar[node.x].y + node.y,
        };
      } else {
        combineSimilar[node.x] = { ...node };
      }
    });

    const out = [];

    Object.keys(combineSimilar).forEach((node) => {
      out.push(combineSimilar[node]);
    });

    return out;
  }

  groupByTop(data) {
    function sortHighToLow(a, b) {
      if (a.y > b.y) return -1;
      if (b.y > a.y) return 1;
      return 0;
    }

    const combine = this.groupSimilar(data);

    const sortValues = combine.sort(sortHighToLow);
    const top5 = sortValues.slice(0, this.sliceCount);
    const others = sortValues.slice(this.sliceCount, sortValues.length + 1);

    const out = [];
    let othersNode = { x: "Others", y: 0 };

    others.forEach((node) => {
      othersNode = { ...othersNode, y: othersNode.y + node.y };
    });

    top5.forEach((node) => {
      out.push({ x: node.x, y: node.y });
    });

    return [...out, othersNode];
  }

  groupByColor(data) {
    const groupColors = {};

    data.forEach((node) => {
      if (node.color) {
        if (node.color in groupColors) {
          groupColors[node.color] = {
            ...groupColors[node.color],
            y: groupColors[node.color].y + node.y,
          };
        } else {
          groupColors[node.color] = node;
        }
      }
    });

    const out = [];

    Object.keys(groupColors).forEach((node) => {
      out.push(groupColors[node]);
    });

    return out;
  }

  resolveDataFormat() {
    const { chartType, direction } = this.configuration;
    if ((chartType === "pie" || chartType === "donut") && this.widgetData) {
      return this.groupByTop(this.widgetData);
    }

    return this.widgetData;
  }

  resolveChart() {
    const { chartType, direction } = this.configuration;
    let chart;

    const data = this.resolveDataFormat();
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
      chart = new BarsHorizontal(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.configuration.color?.identifier
      ).getChart();
    }

    if (chartType === "bar") {
      chart = new Bars(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.configuration.color?.identifier
      ).getChart();
    }

    if (chartType === "stacked-bar") {
      chart = new BarsStacked(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.configuration.color?.identifier
      ).getChart();
    }

    if (chartType === "line") {
      chart = new Line(
        this.configuration,
        this.editor,
        this.schema,
        this.widgetConfig,
        data,
        this.scheme
      ).getChart();
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
