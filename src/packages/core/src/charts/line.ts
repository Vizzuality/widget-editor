import { Charts, Vega, Generic, Widget } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Line implements Charts.Line {
  schema: Vega.Schema;
  widgetConfig: Widget.Payload;
  widgetData: Generic.ObjectPayload;

  constructor(
    schema: Vega.Schema,
    widgetConfig: Widget.Payload,
    widgetData: Generic.ObjectPayload
  ) {
    this.schema = schema;
    this.widgetConfig = widgetConfig;
    this.widgetData = widgetData;

    this.generateSchema();
    this.setGenericSettings();
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

  setGenericSettings() {
    this.schema = {
      ...this.schema,
      height: 300,
      autosize: {
        type: "fit",
        contains: "padding"
      },
      padding: 20
    };
  }

  setScales() {
    return [
     {
        name: "xscale",
        type: "point",
        range: "width",
        domain: { data: "table", field: sqlFields.value },
      },
      {
        name: "yscale",
        type: "linear",
        range: "height",
        nice: true,
        zero: true,
        domain: { data: "table", field: sqlFields.category },
      }
    ];
  }

  setMarks() {
    return [
      {
        "name": "lines",
        "interactive": false,
        "type": "line",
        "from": { "data": "table" },
        "encode": {
          "enter": {
            "x": { "scale": "xscale", "field": "x" },
            "y": { "scale": "yscale", "field": "y" },
            "strokeCap": { "value": "round" },
            "strokeWidth": { "value": 2 },
            "strokeJoin": { "value": "round" }
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

  bindData(): Vega.Data[] {
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
