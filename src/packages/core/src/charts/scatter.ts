import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Scatter implements Charts.Scatter {
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
        round: true,
        nice: true,
        zero: true,
        domain: { data: "table", field: sqlFields.category },
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
        scale: "y",
        labelOverlap: "parity",
        orient: "left",
        encode: {
          labels: {
            update: {
              align: { value: "right" },
              baseline: { value: "bottom" },
            },
          },
        },
        format: this.resolveFormat(),
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
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] },
        ],
      },
    ];
  }

  getChart() {
    return this.schema;
  }
}
