import isObjectLike from "lodash/isObjectLike";

import { Charts, Vega } from "@widget-editor/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import BarsVertical from "../charts/bars-vertical";
import BarsStacked from "../charts/bars-stacked";
import Line from "../charts/line";
import Scatter from "../charts/scatter";

import { SUPPORTED_CHARTS } from "../charts/constants";

import {
  defaultVegaSchema,
  sqlFields,
} from "../helpers/wiget-helper/constants";

const DEFAULT_SCHEME = {
  name: "pine",
  mainColor: "#907A59",
  category: [
    "#907A59",
    "#6AAC9F",
    "#D5C0A1",
    "#5C7D86",
    "#F9AF38",
    "#F05B3F",
    "#89AD24",
    "#CE4861",
    "#F5808F",
    "#86C48F",
    "#F28627",
    "#B23912",
    "#BAD6AF",
    "#C9C857",
    "#665436",
  ],
};

export default class VegaService implements Charts.Service {
  widgetConfig: any;
  widgetData: any;
  configuration: any;
  slizeCount: number;
  scheme: any;
  schema: Vega.Schema;
  colorApplied: boolean;

  constructor(
    widgetConfig: any,
    widgetData: any,
    configuration: any,
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

    this.slizeCount = configuration?.slizeCount || 5;

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
    const top5 = sortValues.slice(0, this.slizeCount);
    const others = sortValues.slice(this.slizeCount, sortValues.length + 1);

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
        this.schema,
        this.widgetConfig,
        data,
        this.scheme
      ).getChart();
    }

    if (chartType === "bar-vertical") {
      chart = new BarsVertical(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
      ).getChart();
    }

    if (chartType === "bar") {
      chart = new Bars(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
      ).getChart();
    }

    if (chartType === "stacked-bar") {
      chart = new BarsStacked(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
      ).getChart();
    }

    if (chartType === "line") {
      chart = new Line(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme
      ).getChart();
    }

    if (chartType === "scatter") {
      chart = new Scatter(
        this.schema,
        this.widgetConfig,
        data,
        this.scheme,
        this.colorApplied
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
