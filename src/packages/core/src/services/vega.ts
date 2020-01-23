import { Charts } from "@packages/types";

import Pie from "../charts/pie";

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

    this.schema = {
      ...this.schema,
      ...chart
    };
  }

  setConfig() {
    // TODO: Support default config if none is present
    this.schema = { ...this.schema, config: this.widgetConfig.config };
  }

  // TODO: Move to @core/charts/pie
  // private getPie(): void {
  //   const marks = this.widgetConfig.marks;

  //   this.schema = {
  //     ...this.schema,
  //     signals: [], // TODO: Check signals, not sure if we need them?
  //     scales: [
  //       {
  //         name: "c",
  //         type: "ordinal",
  //         domain: { data: "table", field: sqlFields.value },
  //         range: { scheme: "category20" }
  //       }
  //     ],
  //     marks: [
  //       {
  //         type: "arc",
  //         from: { data: "table" },
  //         encode: {
  //           enter: {
  //             fill: { scale: "c", field: sqlFields.value },
  //             x: { signal: "width / 2" },
  //             y: { signal: "height / 2" }
  //           },
  //           update: {
  //             startAngle: { field: "startAngle" },
  //             endAngle: { field: "endAngle" },
  //             innerRadius: {
  //               signal: "width > height ? height / 3 : width / 3"
  //             },
  //             outerRadius: { signal: "width > height ? height / 2 : width / 2" }
  //           },
  //           hover: { opacity: { value: 0.8 } }
  //         }
  //       }
  //     ],
  //     data: [
  //       {
  //         values: this.widgetData,
  //         name: "table",
  //         transform: [
  //           {
  //             type: "pie",
  //             field: sqlFields.category,
  //             startAngle: 0,
  //             endAngle: 6.29
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }

  getChart() {
    return this.schema;
  }
}
