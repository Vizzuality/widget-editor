import { Charts } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Bars implements Charts.Chart, Charts.Bars {
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
      axes: this.setAxes(),
      scales: this.setScales(),
      marks: this.setMarks(),
      data: this.bindData()
    };
  }

  setScales() {
    return [
      {
        name: "xscale",
        type: "band",
        domain: { data: "table", field: sqlFields.value },
        range: "width",
        padding: 0.05,
        round: true
      },
      {
        name: "yscale",
        domain: { data: "table", field: sqlFields.category },
        nice: true,
        range: "height"
      }
    ];
  }

  setMarks() {
    return [
      {
        type: "rect",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "xscale", field: sqlFields.value },
            width: { scale: "xscale", band: 1 },
            y: { scale: "yscale", field: sqlFields.category },
            y2: { scale: "yscale", value: 0 }
          },
          update: {
            fill: { value: "steelblue" }
          },
          hover: {
            fill: { value: "red" }
          }
        }
      }
    ];
  }

  setAxes() {
    return [
      { orient: "bottom", scale: "xscale" },
      { orient: "left", scale: "yscale" }
    ];
  }

  bindData() {
    const { widgetData } = this;
    return [
      {
        values: widgetData,
        name: "table"
      }
    ];
  }

  getChart() {
    return this.schema;
  }
}
