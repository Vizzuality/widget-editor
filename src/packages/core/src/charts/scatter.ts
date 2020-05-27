import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Scatter extends ChartsCommon implements Charts.Scatter {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;
  colorApplied: boolean;
  scheme: any;

  constructor(
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload,
    scheme: any,
    colorApplied: boolean
  ) {
    super(widgetConfig);
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.colorApplied = colorApplied;

    this.scheme = scheme;

    this.generateSchema();
    this.setGenericSettings();
  }

  generateSchema() {
    this.schema = {
      ...this.schema,
      axes: this.setAxes(),
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      interaction_config: this.interactionConfig(),
      config: {
        ...this.scheme.config,
        ...(!this.colorApplied
          ? {
              symbol: {
                fill: this.scheme.mainColor,
              },
            }
          : {}),
      },
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

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 400,
      padding: 20,
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

  setScales() {
    const scale: any = [
      {
        name: "x",
        type: "linear",
        domain: { "data": "table", "field": "x" },
        round: true,
        nice: true,
        zero: false,
        range: "width"
      },
      {
        name: "y",
        type: "linear",
        round: true,
        nice: true,
        zero: true,
        domain: { "data": "table", "field": "y" },
        range: "height",
      },
    ];
    if (this.colorApplied) {
      scale.push({
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: sqlFields.category },
        range: this.scheme.category,
      });
    }

    return scale;
  }

  setMarks() {
    return [
      {
        name: "marks",
        type: "symbol",
        from: { data: "table" },
        encode: {
          enter: {
            ...(this.colorApplied
              ? { fill: { scale: "color", field: sqlFields.category } }
              : {}),
          },
          update: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" },
            strokeOpacity: { value: 0 },
            zindex: { value: 0 },
            opacity: { value: 0.5 },
          },
          hover: {
            strokeOpacity: { value: 1 },
            zindex: { value: 1 },
            opacity: { value: 1 },
          },
        },
      },
    ];
  }

  setAxes() {
    return [
      {
        ...this.schema.axis,
        ...this.schema.axisX,
        "scale": "x",
        "labelOverlap": "parity",
        "orient": "bottom",
        "encode": {
          "labels": {
            "update": {
              "align": { "value": "center" },
              "baseline": { "value": "top" }
            }
          }
        }
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        labelBaseline: undefined,
        labelAlign: undefined,
        "scale": "y",
        "labelOverlap": "parity",
        "orient": "left",
        "format": "s"
      }
    ]
  }

  bindData(): Vega.Data[] {
    const { widgetData } = this;
    return [
      {
        values: widgetData,
        name: "table",
        transform: [
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] },
        ],
      },
    ];
  }

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
