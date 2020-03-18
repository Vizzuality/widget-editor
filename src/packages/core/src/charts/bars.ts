import { Charts, Vega, Generic, Widget } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Bars implements Charts.Bars {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;
  scheme: any

  constructor(
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload,
    scheme: any
  ) {
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
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
        rect: {
          fill: this.scheme ? this.scheme.mainColor : this.schema.config.rect.fill
        }
      }
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 400,
      autosize: {
        type: "fit",
        contains: "padding"
      },
      padding: 20
    };
  }

  setScales() {
    return [
      {
        name: "x",
        type: "band",
        domain: { data: "table", field: "id" },
        range: "width",
        padding: 0.05
      },
      {
        name: "y",
        type: "linear",
        domain: { data: "table", field: sqlFields.category },
        nice: true,
        zero: true,
        range: "height"
      }
    ];
  }

  setMarks() {
    return [
      {
        type: "rect",
        from: { data: "table" },
        encode: {
          enter: {
            tooltip: {
              signal: "{'Label': datum.x, 'Value': datum.y }"
            }
          },
          update: {
            opacity: { value: 1 },
            x: { scale: "x", field: "id" },
            width: { scale: "x", band: 1 },
            y: { scale: "y", field: "y" },
            y2: { scale: "y", value: 0 }
          },
          hover: {
            opacity: { value: 0.8 }
          }
        }
      }
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
              format: ".2s"
            },
            {
              column: "x",
              property: "x",
              type: "string",
              format: ".2f"
            }
          ]
        }
      }
    ];
  }

  setAxes() {
    return [
      {
        ...this.schema.axis,
        ...this.schema.axisX,
        orient: "bottom",
        scale: "x",
        labelOverlap: "parity",
        ticks: false,
        encode: {
          labels: {
            update: {
              text: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? truncate(data('table')[datum.value - 1].x, 12) : data('table')[datum.value - 1].x"
              },
              align: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'right' : 'center'"
              },
              baseline: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'middle' : 'top'"
              },
              angle: {
                signal: "width < 300 || data('table')[0].count > 10 ? -90 : 0"
              }
            }
          }
        }
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        format: "s",
        encode: {
          labels: {
            update: {
              align: { value: "right" },
              baseline: { value: "bottom" }
            }
          }
        }
      }
    ];
  }

  bindData(): Vega.Data[] {
    const { widgetData } = this;
    return [
      {
        values: widgetData,
        name: "table",
        transform: [
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] }
        ]
      }
    ];
  }

  getChart() {
    return this.schema;
  }
}
