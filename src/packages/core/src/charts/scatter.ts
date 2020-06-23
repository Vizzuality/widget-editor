import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

export default class Scatter extends ChartsCommon implements Charts.Scatter {
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
      config: this.resolveScheme(),
      legend: this.setLegend(),
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
              property: this.resolveName('y'),
              type: "number",
              format: this.resolveFormat('y'),
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

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      autosize: {
        type: "fit",
        contains: "padding",
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
        domain: {
          data: "table",
          field: "x",
          ...(this.isDate() ? { sort: true } : {})
        },
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
    if (this.colorField) {
      scale.push({
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: this.colorField },
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
            ...(this.colorField
              ? { fill: { scale: "color", field: this.colorField } }
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
        "scale": "x",
        "labelOverlap": "parity",
        "orient": "bottom",
        "encode": {
          "labels": {
            "update": {
              ...(this.isDate()
                ? {
                  text: {
                    signal: `utcFormat(datum.value, '${this.resolveFormat('x')}')`,
                  },
                }
                : {}),
              "align": { "value": "center" },
              "baseline": { "value": "top" }
            }
          }
        }
      },
      {
        labelBaseline: undefined,
        labelAlign: undefined,
        "scale": "y",
        "labelOverlap": "parity",
        "orient": "left",
        format: this.resolveFormat('y'),
        // titleLimit is necessary so the title of the axis fits the viewport
        // If it doesn't the chart might not be displayed at all due to this bug:
        // https://github.com/vega/vega/issues/1350
        titleLimit: { "signal": "height" },
      }
    ]
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
        transform: [
          { type: "identifier", as: "id" },
          { type: "joinaggregate", as: ["count"] },
        ],
      },
    ];
  }

  setLegend() {
    const scheme = this.resolveScheme();

    if (!this.colorField) {
      return null;
    }

    // When the user adds the 3rd dimension (color), the widget data doesn't have the color field
    // available until the fetch is complete, so label might be undefined in the map function
    const values = [...new Set(this.widgetData.map(d => d[this.colorField]))].map((label, index) => ({
      label: label,
      value: scheme.range.category20[index % scheme.range.category20.length],
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

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
