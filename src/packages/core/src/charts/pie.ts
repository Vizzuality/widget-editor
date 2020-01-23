import { Charts } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Pie implements Charts.Chart {
  schema: Charts.Schema;
  widgetConfig: object;
  widgetData: object;

  constructor(schema: Charts.Schema, widgetConfig: object, widgetData: object) {
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;

    this.generateSchema();
  }

  generateSchema() {
    this.schema = {
      ...this.schema,
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData()
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

  bindData() {
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
