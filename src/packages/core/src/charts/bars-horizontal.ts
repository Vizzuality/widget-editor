import { Charts, Vega } from "@widget-editor/types";
import { sqlFields } from "../helpers/wiget-helper/constants";
import ChartsCommon from './chart-common';

export default class BarsHorizontal extends ChartsCommon implements Charts.Bars {
  async generateSchema() {
    this.schema = {
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
        domain: {
          data: "filtered",
          field: sqlFields.category,
        },
        range: "width",
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: "filtered",
          field: "id",
          ...(this.isDate() ? { sort: true } : {})
        },
        range: "height",
        padding: 0.05,
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
        title: this.resolveTitle('y'),
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
        title: this.resolveTitle('x'),
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
        from: { data: "filtered" },
        encode: {
          update: {
            opacity: { value: 1 },
            x: { scale: "x", value: 0 },
            x2: { scale: "x", field: sqlFields.category },
            y: { scale: "y", field: "id" },
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
    const { configuration } = this.store;
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
              type: configuration.category?.type || 'string',
              format: this.resolveFormat('x'),
            },
          ],
        },
      },
    ];
  }

  bindData(): Vega.Data[] {
    const { editor: { widgetData } } = this.store;
    return [
      {
        name: "table",
        values: [...widgetData].map(d => ({ ...d })),
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
      {
        name: "filtered",
        source: "table",
        transform: [
          ...this.resolveEndUserFiltersTransforms(),
        ],
      },
    ];
  }

  setLegend() {
    return null;
  }

  async getChart() {
    await this.generateSchema();
    this.setGenericSettings();
    return this.schema;
  }
}
