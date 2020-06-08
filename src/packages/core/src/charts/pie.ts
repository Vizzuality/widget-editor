import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

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
    super(widgetConfig, widgetData);
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
              column: "value",
              property: this.widgetConfig?.paramsConfig?.value.alias
                || this.widgetConfig?.paramsConfig?.value.name,
              type: "number",
              format: this.resolveFormat('y'),
            },
            {
              column: "category",
              property: this.widgetConfig?.paramsConfig?.category.alias
                || this.widgetConfig?.paramsConfig?.category.name,
              type: 'string',
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
          field: 'value',
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
            fill: { scale: "c", field: 'value' },
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
        transform: [
          {
            "type": "window",
            "ops": ["row_number"], "as": ["rank"]
          },
          {
            "type": "formula",
            "as": "category",
            "expr": "datum.rank < 6 ? datum.x : 'Others'"
          },
          {
            "type": "aggregate",
            "groupby": ["category"],
            "ops": ["sum"],
            "fields": ["y"],
            "as": ["value"]
          },
          {
            "type": "pie",
            "field": "value",
            "startAngle": 0,
            "endAngle": 6.29
          }
        ],
      },
    ];
  }

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
