import { Charts, Vega, Generic, Widget } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class BarsVertical implements Charts.Bars {
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
      data: this.bindData()
      interaction_config: this.interactionConfig(),
      config: {
        ...this.scheme.config,
        rect: {
          fill: this.scheme
            ? this.scheme.mainColor
            : this.schema.config.rect.fill
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
        type: "linear",
        domain: {
          data: "table",
          field: sqlFields.category
        },
        range: "width"
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: "table",
          field: "x"
        },
        range: "height",
        padding: 0.05
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
        grid: true,
        labelOverlap: "parity"
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        ticks: false,
        grid: false,
        encode: {
          labels: {
            update: {
              text: {
                signal: "truncate(datum.value, 12)"
              },
              align: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'right' : 'center'"
              },
              baseline: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'middle' : 'top'"
              }
            }
          }
        }
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
            x: { scale: "x", value: 0 },
            x2: { scale: "x", field: sqlFields.category },
            y: { scale: "y", field: "x" },
            height: { scale: "y", band: 1 }
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
