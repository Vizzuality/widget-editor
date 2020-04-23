import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Pie implements Charts.Pie {
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
        domain: { data: "table", field: sqlFields.value },
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
            tooltip: {
              signal: "{'Label': datum.x, 'Value': datum.y }",
            },
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
    return this.schema;
  }
}
