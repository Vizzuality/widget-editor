import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

import signalsHelper from "../helpers/signals-helper";

export default class BarsStacked implements Charts.Bars {
  schema: any;
  widgetConfig: any;
  widgetData: Generic.ObjectPayload;
  colorApplied: boolean;
  scheme: any;

  constructor(
    schema: any,
    widgetConfig: any,
    widgetData: Generic.ObjectPayload,
    scheme: any,
    colorApplied: boolean
  ) {
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
    const scale: any = [
      {
        name: "x",
        type: "band",
        domain: {
          data: "table",
          field: "id",
        },
        range: "width",
        padding: 0.05,
      },
      {
        name: "y",
        type: "linear",
        domain: {
          data: "table",
          field: sqlFields.category,
        },
        nice: true,
        zero: true,
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
        type: "rect",
        from: { data: "table" },
        encode: {
          enter: {
            tooltip: {
              signal: signalsHelper(this.widgetConfig, "datum.y", "datum.x"),
            },
            ...(this.colorApplied
              ? { fill: { scale: "color", field: sqlFields.category } }
              : {}),          },
          update: {
            opacity: { value: 1 },
            x: { scale: "x", field: "id" },
            width: { scale: "x", band: 1 },
            y: { scale: "y", field: "y" },
            y2: { scale: "y", value: 0 },
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

  resolveFormat() {
    const format = this.widgetConfig?.paramsConfig?.format || "s";
    return format;
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
                  "width < 300 || data('table')[0].count > 10 ? truncate(data('table')[datum.value - 1].x, 12) : data('table')[datum.value - 1].x",
              },
              align: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'right' : 'center'",
              },
              baseline: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'middle' : 'top'",
              },
              angle: {
                signal: "width < 300 || data('table')[0].count > 10 ? -90 : 0",
              },
            },
          },
        },
      },
      {
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        format: this.resolveFormat(),
        encode: {
          labels: {
            update: {
              align: { value: "right" },
              baseline: { value: "bottom" },
            },
          },
        },
      },
    ];
  }

  bindData(): Vega.Data[] {
    const { widgetData, scheme } = this;
    return [
      {
        values: widgetData,
        name: "table",
        transform: [
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] },
          {
            type: "stack",
            groupby: ["x"],
            sort: { field: "x"},
            field: "y"
          }
        ],
      },
    ];
  }

  getChart() {
    return this.schema;
  }
}
