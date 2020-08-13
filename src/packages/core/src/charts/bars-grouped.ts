import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { Charts, Vega, Generic } from "@widget-editor/types";

import ChartsCommon from './chart-common';

export default class GroupedBars extends ChartsCommon implements Charts.Bars {
  configuration: any;
  editor: any;
  schema: any;
  widgetConfig: any;
  widgetData: Generic.ObjectPayload;
  colorField: string;

  constructor(
    configuration: any,
    editor: any,
    schema: any,
    widgetConfig: any,
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
    return [
      {
        name: "x",
        type: "band",
        domain: {
          data: "table",
          field: "x",
          ...(this.isDate() ? { sort: true } : {})
        },
        range: "width",
        "padding": 0.1,
      },
      {
        name: "y",
        type: "linear",
        domain: {
          data: "table",
          field: "y",
        },
        nice: true,
        zero: true,
        range: "height",
      },
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "color" },
        range: this.scheme.category,
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
            "x": { "scale": "x", "field": "x" }
          }
        },
        "signals": [
          { "name": "width", "update": "bandwidth('x')" }
        ],
        "scales": [
          {
            "name": "pos",
            "type": "band",
            "range": "width",
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
                "x": { "scale": "pos", "field": "color" },
                "width": { "scale": "pos", "band": 1 },
                "y": { "scale": "y", "field": "y" },
                "y2": { "scale": "y", "value": 0 }
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
              property: this.resolveName('color'),
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

  setAxes() {
    return [
      {
        orient: "bottom",
        scale: "x",
        labelOverlap: "parity",
        ticks: false,
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
              },
              angle: {
                signal: "width < 300 || data('table')[0].count > 10 ? -90 : 0",
              },
            },
          }
        },
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
        transform: [
          { "type": "joinaggregate", "ops": ["distinct"], "fields": ["x"], "as": ["count"] }
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

  getChart() {
    return this.schema;
  }
}
