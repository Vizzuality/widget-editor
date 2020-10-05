import { Charts, Vega } from "@widget-editor/types";
import { sqlFields } from "../helpers/wiget-helper/constants";
import ChartsCommon from './chart-common';

export default class Line extends ChartsCommon implements Charts.Line {
  async generateSchema() {
    this.schema = {
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
    const { configuration } = this.store;
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
              type: configuration.category?.type || 'string',
              format: this.resolveFormat('x'),
            },
          ],
        },
      },
    ];
  }

  setScales() {
    const { editor: { widgetData: data } } = this.store;

    // In v1, if the chart would display points that have all the same y value, we would modify the
    // Y domain so it looks nicer
    let yDomain: any = { data: "table", field: sqlFields.category };
    const oneYValue = !!data.length
      && data.every(d => d[sqlFields.category] === data[0][sqlFields.category]);
    if (data.length === 1 || oneYValue) {
      // The step is 20% of the value
      const step = data[0].y * 0.2;

      // We fix the domain around the value
      yDomain = [data[0].y - step, data[0].y + step];
    }

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
        domain: yDomain,
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
        transform: this.resolveEndUserFiltersTransforms(),
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
