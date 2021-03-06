import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

import { Charts, Vega } from "@widget-editor/types";
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import ChartsCommon from './chart-common';

export default class BarsStacked extends ChartsCommon implements Charts.Bars {
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
    const scheme = selectScheme(this.store);
    const scale: any = [
      {
        name: "x",
        type: "band",
        domain: {
          data: "filtered",
          field: "x",
        },
        range: "width",
        padding: 0.05,
      },
      {
        name: "y",
        type: "linear",
        domain: {
          data: "filtered",
          field: "y1",
        },
        nice: true,
        zero: true,
        range: "height",
      },
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "color" },
        range: scheme.category,
      },
    ];

    return scale;
  }

  setMarks() {
    return [
      {
        type: "rect",
        from: { data: "filtered" },
        encode: {
          update: {
            opacity: { value: 1 },
            fill: { scale: "color", field: "color" },
            x: { scale: "x", field: "x" },
            width: { scale: "x", band: 1 },
            y: { scale: "y", field: "y0" },
            y2: { scale: "y", field: "y1" },
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
              column: "color",
              property: this.resolveName('color'),
              type: "string",
              format: ".2f"
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

  setAxes() {
    return [
      {
        orient: "bottom",
        scale: "x",
        labelOverlap: "parity",
        ticks: false,
        title: this.resolveTitle('x'),
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
        title: this.resolveTitle('y'),
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
    const { editor: { widgetData } } = this.store;
    return [
      {
        values: [...widgetData].map(d => ({ ...d })),
        name: "table",
        ...(this.isDate() ? {
          format: {
            parse: {
              x: 'date'
            }
          }
        } : {}),
        transform: [
          { "type": "stack", "field": "y", "groupby": ["x"], "sort": { "field": "color" } },
          { "type": "joinaggregate", "ops": ["distinct"], "fields": ["x"], "as": ["count"] }
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
    const scheme = this.resolveScheme();
    const { editor: { widgetData } } = this.store;

    if (!widgetData) {
      return null;
    }

    const colorValuesOrder = [
      ...new Set(widgetData.map((d: { color: string | number }) => d.color))
    ];
    const colorRange = scheme.range.category20;
    const getColor = d => colorRange[colorValuesOrder.indexOf(d.color)];
    const values = sortBy(uniqBy(widgetData, 'color'), ['color'], ['asc'])
      .map((d: { [key: string]: any }) => ({
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
