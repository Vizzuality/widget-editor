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
  colorApplied: boolean;
  scheme: any;

  constructor(
    configuration: any,
    editor: any,
    schema: any,
    widgetConfig: any,
    widgetData: Generic.ObjectPayload,
    scheme: any,
    colorApplied: boolean
  ) {
    super(configuration, editor, widgetData);
    this.configuration = configuration;
    this.editor = editor;
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;
    this.colorApplied = colorApplied;

    this.scheme = scheme;

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
      config: {
        ...this.scheme.config,
        ...(!this.colorApplied
          ? {
            rect: {
              fill: this.scheme.mainColor,
            },
          }
          : {}),
      },
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 400,
      padding: 20,
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

    if (this.colorApplied) {
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
            ...(this.colorApplied
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
    const categoryProperty = this.resolveName('x');

    let valueProperty = this.resolveName('y');
    if (this.configuration.aggregateFunction) {
      valueProperty = `${valueProperty} (${this.configuration.aggregateFunction})`;
    }

    return [
      {
        name: "tooltip",
        config: {
          fields: [
            {
              column: "y",
              property: valueProperty,
              type: "number",
              format: this.resolveFormat('y'),
            },
            {
              column: "x",
              property: categoryProperty,
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
        ...this.schema.axis,
        ...this.schema.axisX,
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
        ...this.schema.axis,
        ...this.schema.axisY,
        orient: "left",
        scale: "y",
        labelOverlap: "parity",
        format: this.resolveFormat('y'),
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

  getChart() {
    const parseSignals = new ParseSignals(this.schema, this.widgetConfig, this.isDate()).serializeSignals();
    return parseSignals;
  }
}
