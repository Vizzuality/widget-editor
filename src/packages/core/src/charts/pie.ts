import uniqBy from 'lodash/uniqBy';

import { Charts, Vega } from "@widget-editor/types";
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import ChartsCommon from './chart-common';

export default class Pie extends ChartsCommon implements Charts.Pie {
  async generateSchema() {
    this.schema = {
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      config: this.resolveScheme(),
      interaction_config: this.interactionConfig(),
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
              column: "value",
              property: this.resolveName('y'),
              type: "number",
              format: '.2s',
            },
            {
              column: "category",
              property: this.resolveName('x'),
              type: 'string',
            },
          ],
        },
      },
    ];
  }

  setScales() {
    const scheme = selectScheme(this.store);
    return [
      {
        name: "c",
        type: "ordinal",
        domain: {
          data: "table",
          field: 'value',
        },
        range: scheme.category,
      },
    ];
  }

  resolveInnerRadius() {
    const { configuration } = this.store;

    if (configuration.chartType === "pie") {
      return "0";
    }

    return configuration.donutRadius;
  }

  setMarks() {
    return [
      {
        type: "arc",
        from: { data: "table" },
        encode: {
          enter: {
            fill: { scale: "c", field: 'value' },
            x: { signal: "width / 2" },
            y: { signal: "height / 2" },
          },
          update: {
            startAngle: { field: "startAngle" },
            endAngle: { field: "endAngle" },
            innerRadius: {
              signal: this.resolveInnerRadius(),
            },
            outerRadius: { signal: "width > height ? height / 2 : width / 2" },
            opacity: {
              value: 1,
            },
          },
          hover: { opacity: { value: 0.8 } },
        },
      },
    ];
  }

  bindData(): Vega.Data[] {
    const { editor: { widgetData }, configuration } = this.store;
    return [
      {
        values: widgetData,
        name: "table",
        transform: [
          {
            "type": "window",
            "ops": ["row_number"], "as": ["rank"]
          },
          {
            "type": "formula",
            "as": "category",
            "expr": `datum.rank < ${configuration.sliceCount} ? datum.x : 'Others'`
          },
          {
            "type": "aggregate",
            "groupby": ["category"],
            "ops": ["sum"],
            "fields": ["y"],
            "as": ["value"]
          },
          {
            "type": "pie",
            "field": "value",
            "startAngle": 0,
            "endAngle": 6.29
          }
        ],
      },
    ];
  }

  setLegend() {
    const scheme = this.resolveScheme();
    const { editor: { widgetData }, configuration } = this.store;

    if (!widgetData) {
      return null;
    }

    const values = uniqBy(
      widgetData.map((d: { x: any }, i) => ({ ...d, x: i + 1 < configuration.sliceCount ? d.x : 'Others' })),
      'x'
    )
      .slice(0, configuration.sliceCount)
      .map((d, i) => ({
        label: d.x,
        value: scheme.range.category20[i % configuration.sliceCount],
        type: 'string'
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
