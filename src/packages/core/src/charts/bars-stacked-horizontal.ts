import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';

export default class BarsHorizontal extends ChartsCommon implements Charts.Bars {
  configuration: any;
  editor: any;
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;
  colorField: string;

  constructor(
    configuration: any,
    editor: any,
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload,
    scheme: any,
    colorField: string,
  ) {
    super(configuration, editor, widgetData, scheme);
    this.configuration = configuration;
    this.editor = editor;
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.colorField = colorField;
  }

  async generateSchema() {
    this.schema = {
      ...this.schema,
      axes: this.setAxes(),
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      interaction_config: this.interactionConfig(),
      config: this.resolveScheme(),
      legend: this.setLegend(),
      signals: await this.resolveSignals(),
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
    };
  }

  setScales() {
    const scale = [
      {
        name: "x",
        type: "linear",
        nice: true,
        zero: true,
        domain: {
          data: "table",
          field: "y1",
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
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "color" },
        range: this.scheme.category,
      },
    ];

    return scale;
  }

  setAxes() {
    return [
      {
        orient: "bottom",
        scale: "x",
        format: this.resolveFormat('y'),
        grid: true,
        labelOverlap: "parity",
        encode: {
          labels: {
            update: {
              align: { value: "center" },
              baseline: { value: "middle" }
            }
          }
        },
      },
      {
        orient: "left",
        scale: "y",
        ticks: false,
        grid: false,
        labelOverlap: "parity",
        labelAlign: "right",
        // titleLimit is necessary so the title of the axis fits the viewport
        // If it doesn't the chart might not be displayed at all due to this bug:
        // https://github.com/vega/vega/issues/1350
        titleLimit: { "signal": "height" },
        encode: {
          labels: {
            update: {
              text: {
                signal: this.isDate()
                  ? `utcFormat(datum.value, '${this.resolveFormat('x')}')`
                  : "truncate(datum.value, 12)",
              },
              align: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'right' : 'center'",
              },
              baseline: {
                signal:
                  "width < 300 || data('table')[0].count > 10 ? 'middle' : 'top'",
              }
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
          update: {
            opacity: { value: 1 },
            fill: { scale: "color", field: "color" },
            x: { scale: "x", field: "y0" },
            x2: { scale: "x", field: "y1" },
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
              property: this.resolveName('y'),
              type: "number",
              format: '.2s',
            },
            {
              column: "color",
              property: "color",
              type: "string",
              format: ".2f"
            },
            {
              column: "x",
              property: this.resolveName('x'),
              type: this.configuration.category?.type || 'string',
              format: this.resolveFormat('x'),
            },
          ],
        },
      },
    ];
  }

  bindData(): Vega.Data[] {
    return [
      {
        values: this.widgetData,
        name: "table",
        ...(this.isDate() ? {
          format: {
            parse: {
              x: 'date'
            }
          }
        } : {}),
        transform: [
          { type: "stack", field: "y", groupby: ["x"], sort: { field: "color" } },
          { type: "joinaggregate", ops: ["distinct"], fields: ["x"], as: ["count"] }
        ],
      },
    ];
  }

  setLegend() {
    const scheme = this.resolveScheme();

    if (!this.widgetData) {
      return null;
    }

    const colorValuesOrder = [...new Set(this.widgetData.map((d: { color: string | number }) => d.color))];
    const colorRange = scheme.range.category20;
    const getColor = d => colorRange[colorValuesOrder.indexOf(d.color)];
    const values = sortBy(uniqBy(this.widgetData, 'color'), ['color'], ['asc'])
      .map((d: { color: string | number }) => ({
        label: d.color,
        value: getColor(d),
        type: 'string',
      }));

    return [
      {
        type: 'color',
        label: null,
        shape: 'square',
        values,
      }
    ];
  }

  async getChart() {
    await this.generateSchema();
    this.setGenericSettings();
    return this.schema;
  }
}
