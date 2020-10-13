import { Charts, Vega } from "@widget-editor/types";
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import ChartsCommon from './chart-common';

export default class Scatter extends ChartsCommon implements Charts.Scatter {
  async generateSchema() {
    this.schema = {
      axes: this.setAxes(),
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      interaction_config: this.interactionConfig(),
      config: this.resolveScheme(),
      legend: this.setLegend(),
      signals: [
        ...await this.resolveSignals(),
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

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      autosize: {
        type: "fit",
        contains: "padding",
      },
    };
  }

  setScales() {
    const { configuration: { color }, editor: { widgetData: data } } = this.store;
    const colorField = color?.name;
    const scheme = selectScheme(this.store);

    // In v1, if the chart would display points that have all the same y value, we would modify the
    // Y domain so it looks nicer
    let yDomain: any = { "data": "filtered", "field": "y" };
    const oneYValue = !!data.length
      && data.every(d => d.y === data[0].y);
    if (data.length === 1 || oneYValue) {
      // The step is 20% of the value
      const step = data[0].y * 0.2;

      // We fix the domain around the value
      yDomain = [data[0].y - step, data[0].y + step];
    }

    const scale: any = [
      {
        name: "x",
        type: "linear",
        domain: {
          data: "filtered",
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
        domain: yDomain,
        range: "height",
      },
    ];

    if (colorField) {
      scale.push({
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: colorField },
        range: scheme.category,
      });
    }

    return scale;
  }

  setMarks() {
    const { configuration: { color } } = this.store;
    const colorField = color?.name;

    return [
      {
        name: "marks",
        type: "symbol",
        from: { data: "filtered" },
        encode: {
          enter: {
            ...(colorField
              ? { fill: { scale: "color", field: colorField } }
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
      },
      {
        name: "filtered",
        source: "table",
        transform: this.resolveEndUserFiltersTransforms(),
      },
    ];
  }

  setLegend() {
    const scheme = this.resolveScheme();
    const { editor: { widgetData }, configuration: { color } } = this.store;
    const colorField = color?.name;

    if (!colorField || !widgetData) {
      return null;
    }

    // When the user adds the 3rd dimension (color), the widget data doesn't have the color field
    // available until the fetch is complete, so label might be undefined in the map function
    const values = [...new Set(widgetData.map(d => d[colorField]))].map((label, index) => ({
      label,
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

  async getChart() {
    await this.generateSchema();
    this.setGenericSettings();
    return this.schema;
  }
}
