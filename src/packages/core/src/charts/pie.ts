import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Pie extends ChartsCommon implements Charts.Pie {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;
  scheme: any;

  constructor(
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload,
    scheme: any
  ) {
    super(widgetConfig);
    this.schema = schema;
    this.scheme = scheme;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;

    this.generateSchema();
    this.setGenericSettings();
  }

  generateSchema() {
    this.schema = {
      ...this.schema,
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      interaction_config: this.interactionConfig(),
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      width: 400,
      height: 400,
      autosize: {
        type: "fit",
        contains: "padding",
        resize: true,
      },
      signals: [
        {
          name: "width",
          value: "",
          on: [
            {
              events: {
                source: "window",
                type: "resize",
              },
              update: "containerSize()[0]*0.95",
            },
          ],
        },
      ],
    };
  }

  interactionConfig() {
    if (this.widgetConfig.hasOwnProperty('interaction_config')) {
      return this.widgetConfig.interaction_config;
    }
    return [
      {
        name: "tooltip",
        config: {
          fields: [
            {
              column: "y",
              property: "y",
              type: "number",
              format: ".2s",
            },
            {
              column: "x",
              property: "x",
              type: "string",
              format: ".2f",
            },
          ],
        },
      },
    ];
  }

  setScales() {
    return [
      {
        name: "c",
        type: "ordinal",
        domain: { 
          data: "table", 
          field: sqlFields.value,
          ...(this.isDate() ? { sort: true } : {})
        },
        range: this.scheme ? this.scheme.category : "category20",
      },
    ];
  }

  resolveInnerRadius() {
    const chartType = this.widgetConfig?.paramsConfig?.chartType || "pie";
    const radius = this.widgetConfig?.paramsConfig?.donutRadius || 100;
    if (chartType === "pie") {
      return "0";
    }
    return radius;
  }

  setMarks() {
    return [
      {
        type: "arc",
        from: { data: "table" },
        encode: {
          enter: {
            fill: { scale: "c", field: sqlFields.value },
            x: { signal: "width / 2" },
            y: { signal: "height / 2" },
          },
          update: {
            startAngle: { field: "startAngle" },
            endAngle: { field: "endAngle" },
            innerRadius: {
              signal: this.resolveInnerRadius(),
            },
            outerRadius: { signal: "width > height ? height / 2 : width / 2" },
            opacity: {
              value: 1,
            },
          },
          hover: { opacity: { value: 0.8 } },
        },
      },
    ];
  }

  bindData(): Vega.Data[] {
    const { widgetData } = this;

    return [
      {
        values: widgetData,
        name: "table",
        ...(this.isDate() ? {
          format: {
            parse: {
              x: 'date'
            }
          }
        } : {}),
        transform: [
          {
            type: "pie",
            field: sqlFields.category,
            startAngle: 0,
            endAngle: 6.29,
          },
        ],
      },
    ];
  }

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
