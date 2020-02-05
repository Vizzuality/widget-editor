import { Charts, Vega, Generic, Widget } from '@packages/types';

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Pie implements Charts.Pie {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;

  constructor(schema: Vega.Schema, widgetConfig: Widget.Payload, widgetData: Generic.ObjectPayload) {
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
      data: this.bindData()
    };
  }

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      width: 400,
      height: 400
    };
  }

  setScales() {
    return [
      {
        name: "c",
        type: "ordinal",
        domain: { data: "table", field: sqlFields.value },
        range: { scheme: "category20" }
      }
    ];
  }

  setMarks() {
    return [
      {
        type: "arc",
        from: { data: "table" },
        encode: {
          enter: {
            fill: { scale: "c", field: sqlFields.value },
            x: { signal: "width / 2" },
            y: { signal: "height / 2" }
          },
          update: {
            startAngle: { field: "startAngle" },
            endAngle: { field: "endAngle" },
            innerRadius: {
              signal: "width > height ? height / 3 : width / 3"
            },
            outerRadius: { signal: "width > height ? height / 2 : width / 2" }
          },
          hover: { opacity: { value: 0.8 } }
        }
      }
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
            type: "pie",
            field: sqlFields.category,
            startAngle: 0,
            endAngle: 6.29
          }
        ]
      }
    ];
  }

  getChart() {
    return this.schema;
  }
}
