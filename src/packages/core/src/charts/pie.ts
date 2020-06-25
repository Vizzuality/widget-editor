import { Charts, Vega, Generic, Widget } from "@widget-editor/types";

import ChartsCommon from './chart-common';
import ParseSignals from './parse-signals';

export default class Pie extends ChartsCommon implements Charts.Pie {
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

    this.generateSchema();
    this.setGenericSettings();
  }

  generateSchema() {
    this.schema = {
      ...this.schema,
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData(),
      config: this.resolveScheme(),
      interaction_config: this.interactionConfig(),
      legend: this.setLegend(),
    };
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
    return [
      {
        name: "c",
        type: "ordinal",
        domain: {
          data: "table",
          field: 'value',
        },
        range: 'category20',
      },
    ];
  }

  resolveInnerRadius() {
    if (this.configuration.chartType === "pie") {
      return "0";
    }

    return this.configuration.donutRadius;
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
    const { widgetData } = this;
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
            "expr": "datum.rank < 6 ? datum.x : 'Others'"
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

    if (!this.widgetData) {
      return null;
    }

    return [
      {
        type: 'color',
        label: null,
        shape: 'square',
        values: this.widgetData.map((d: { x: string, y: number }, index) => ({
          label: d.x,
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
