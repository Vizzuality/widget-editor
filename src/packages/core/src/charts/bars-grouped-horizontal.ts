import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

import { sqlFields } from "../helpers/wiget-helper/constants";

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
        domain: {
          data: "table",
          field: "y",
        },
        range: "width",
        nice: true,
        zero: true,
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: "table",
          field: "x",
        },
        range: "height",
        padding: 0.1,
      },
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "color" },
        range: this.scheme.category,
      }
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
        }
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
        "type": "group",
        "from": {
          "facet": {
            "data": "table",
            "name": "facet",
            "groupby": "x"
          }
        },
        "encode": {
          "enter": {
            "y": { "scale": "y", "field": "x" }
          }
        },
        "signals": [
          { "name": "height", "update": "bandwidth('y')" }
        ],
        "scales": [
          {
            "name": "pos",
            "type": "band",
            "range": "height",
            "domain": {
              "data": "facet",
              "field": "color",
              "sort": true
            }
          }
        ],
        "marks": [
          {
            "type": "rect",
            "from": { "data": "facet" },
            "encode": {
              "update": {
                "opacity": { "value": 1 },
                "fill": { "scale": "color", "field": "color" },
                "y": { "scale": "pos", "field": "color" },
                "height": { "scale": "pos", "band": 1 },
                "x": { "scale": "x", "field": "y" },
                "x2": { "scale": "x", "value": 0 }
              },
              "hover": {
                "opacity": { "value": 0.8 }
              }
            }
          }
        ]
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
          { "type": "joinaggregate", "ops": ["distinct"], "fields": ["x"], "as": ["count"] },
        ],
      },
    ];
  }

  // FIXME: this is temporal, bar charts with a 3rd dimension (color) should be grouped bar charts
  // This fix just displays the legend correctly while the grouped bar chart visualisation is
  // brought back
  setLegend() {
    const scheme = this.resolveScheme();

    if (!this.colorField || !this.widgetData) {
      return null;
    }

    return [
      {
        type: 'color',
        label: null,
        shape: 'square',
        values: this.widgetData.map((d: { x: string, y: number }, index) => ({
          label: d[this.colorField],
          value: scheme.range.category20[index % scheme.range.category20.length],
          type: 'string',
        }))
      }
    ];
  }

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}