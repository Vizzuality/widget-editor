import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Line extends ChartsCommon implements Charts.Line {
  configuration: any;
  editor: any;
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;

  constructor(
    configuration: any,
    editor: any,
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload,
    scheme: any
  ) {
    super(configuration, editor, widgetData, scheme);
    this.configuration = configuration;
    this.editor = editor;
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
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
      autosize: {
        type: "fit",
        contains: "padding",
      },
      signals: [
        ...await this.resolveSignals(),
        {
          name: "hover",
          value: null,
          on: [
            {
              events: "@cell:mouseover",
              update: "datum",
            },
            {
              events: "@cell:mouseout",
              update: "null",
            },
          ],
        },
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

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      autosize: {
        type: "fit",
        contains: "padding",
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
              column: "datum.y",
              property: this.resolveName('y'),
              type: "number",
              format: '.2s',
            },
            {
              column: "datum.x",
              property: this.resolveName('x'),
              type: this.configuration.category?.type || 'string',
              format: this.resolveFormat('x'),
            },
          ],
        },
      },
    ];
  }

  setScales() {
    return [
      {
        name: "x",
        type: this.isDate() ? 'utc' : 'point',
        range: "width",
        domain: {
          data: "table",
          field: "x",
          ...(this.isDate() ? { sort: true } : {})
        },
      },
      {
        name: "y",
        type: "linear",
        range: "height",
        nice: true,
        zero: true,
        domain: { data: "table", field: sqlFields.category },
      },
    ];
  }

  setMarks() {
    return [
      {
        name: "lines",
        interactive: false,
        type: "line",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" },
            strokeCap: { value: "round" },
            strokeWidth: { value: 2 },
            strokeJoin: { value: "round" },
          },
        },
      },
      {
        name: "points",
        interactive: false,
        type: "symbol",
        from: { data: "dots" },
        encode: {
          enter: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" }
          },
          update: {
            opacity: { value: 1 },
          },
        },
      },
      {
        name: "cell",
        type: "path",
        from: { data: "lines" },
        transform: [
          {
            type: "voronoi",
            x: "datum.x",
            y: "datum.y",
            size: [{ signal: "width" }, { signal: "height" }],
          },
        ],
        encode: {
          update: {
            path: { field: "path" },
            fill: { value: "red" },
            opacity: { value: 0 },
          },
        },
      },
    ];
  }

  setAxes() {
    return [
      {
        orient: "bottom",
        scale: "x",
        ...(this.isDate() ? {
          encode: {
            labels: {
              update: {
                text: {
                  signal: `utcFormat(datum.value, '${this.resolveFormat('x')}')`,
                }
              }
            }
          }
        } : {}),
        labelOverlap: "parity",
        ticks: false,
      },
      {
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        format: this.resolveFormat('y'),
        // titleLimit is necessary so the title of the axis fits the viewport
        // If it doesn't the chart might not be displayed at all due to this bug:
        // https://github.com/vega/vega/issues/1350
        titleLimit: { "signal": "height" },
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
      },
      {
        name: "dots",
        source: "table",
        transform: [
          {
            type: "filter",
            expr: "hover && hover.datum.x === datum.x",
          },
        ],
      },
    ];
  }

  async getChart() {
    await this.generateSchema();
    this.setGenericSettings();
    return this.schema;
  }
}
