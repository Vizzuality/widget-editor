import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class BarsStacked extends ChartsCommon implements Charts.Bars {
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

    if (this.colorField) {
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
            ...(this.colorField
              ? { fill: { scale: "color", field: sqlFields.category } }
              : {}),
          },
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
              property: this.resolveName('y'),
              type: "number",
              format: '.2s',
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
                  ? `utcFormat(data('table')[datum.value - 1].x, '${this.resolveFormat('x')}')`
                  : "truncate(data('table')[datum.value - 1].x, 12)",
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
    const { widgetData, scheme } = this;
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
          {
            type: "stack",
            groupby: ["x"],
            sort: { field: "x" },
            field: "y"
          }
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
