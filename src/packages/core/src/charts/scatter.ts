import { Charts, Vega, Generic, Widget } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class Scatter implements Charts.Scatter {
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
        "name": "xscale",
        "type": "linear",
        "round": true,
        "nice": true,
        "zero": false,
        "domain": { data: "table", field: sqlFields.value },
        "range": "width"
      },
      {
        "name": "yscale",
        "type": "linear",
        "round": true,
        "nice": true,
        "zero": true,
        "domain": { data: "table", field: sqlFields.category },
        "range": "height"
      }
    ];
  }

  setMarks() {
    return [
      {
        "name": "marks",
        "type": "symbol",
        "from": { "data": "table" },
        "encode": {
          "update": {
            "x": { "scale": "xscale", "field": "x" },
            "y": { "scale": "yscale", "field": "y" },
            "strokeOpacity": { "value": 0 },
            "zindex": { "value": 0 },
            "opacity": { "value": 0.5 }
          },
          "hover": {
            "strokeOpacity": { "value": 1 },
            "zindex": { "value": 1 },
            "opacity": { "value": 1 }
          }
        }
      }
    ];
  }

  setAxes() {
    return [
     {
        "scale": "xscale",
        "labelOverlap": "parity",
        "orient": "bottom",
        "encode": {
          "labels": {
            "update": {
              "align": { "value": "center" },
              "baseline": { "value": "top" }
            }
          }
        }
      },
      {
        "scale": "yscale",
        "labelOverlap": "parity",
        "orient": "left",
        "format": "s"
      }
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
