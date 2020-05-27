import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class BarsHorizontal extends ChartsCommon implements Charts.Bars {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;
  scheme: any;
  colorApplied: boolean;

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
    this.scheme = scheme;
    this.colorApplied = colorApplied;

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
              rect: {
                fill: this.scheme.mainColor,
              },
            }
          : {}),
      },
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 400,
      padding: 20,
    };
  }

  setScales() {
    const scale = [
      {
        name: "x",
        type: "linear",
        domain: {
          data: "table",
          field: sqlFields.category,
        },
        range: "width",
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: "table",
          field: "x",
        },
        range: "height",
        padding: 0.05,
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

  setAxes() {
    return [
      {
        ...this.schema.axis,
        ...this.schema.axisX,
        orient: "bottom",
        scale: "x",
        format: this.resolveFormat(),
        grid: true,
        labelOverlap: "parity",
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        ticks: false,
        grid: false,
        labelOverlap: "parity",
        labelAlign: "right",
        encode: {
          labels: {
            update: {
              text: {
                signal: this.isDate() ? "utcFormat(datum.value, '%d %b')" : "truncate(datum.value, 12)",
              },
              ...(!this.isDate() ? {
                align: {
                  signal:
                    "width < 300 || data('table')[0].count > 10 ? 'right' : 'center'",
                },
                baseline: {
                  signal:
                    "width < 300 || data('table')[0].count > 10 ? 'middle' : 'top'",
                }
              } : {})
            },
          },
        },
      },
    ];
  }

  setMarks() {
    return [
      {
        type: "rect",
        from: { data: "table" },
        encode: {
          enter: {
            ...(this.colorApplied
              ? { fill: { scale: "color", field: sqlFields.category } }
              : {}),
          },
          update: {
            opacity: { value: 1 },
            x: { scale: "x", value: 0 },
            x2: { scale: "x", field: sqlFields.category },
            y: { scale: "y", field: "x" },
            height: { scale: "y", band: 1 },
          },
          hover: {
            opacity: { value: 0.8 },
          },
        },
      },
    ];
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

  bindData(): Vega.Data[] {
    const { widgetData, widgetConfig } = this;

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
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] },
        ],
      },
      {
        values: {
          xCol: widgetConfig?.paramsConfig?.value?.alias,
          yCol: widgetConfig?.paramsConfig?.category?.alias,
        },
        name: "properties",
      },
    ];
  }

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
