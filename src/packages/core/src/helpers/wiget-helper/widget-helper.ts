import { WidgetHelpers } from "@packages/types";
import { defaultVegaSchema } from "./constants";

class WidgetHelper implements WidgetHelpers.WidgetHelper {
  schema: WidgetHelpers.Schema;
  data: object;
  widgetConfig: WidgetHelpers.WidgetConfig;
  configuration: WidgetHelpers.Configuration;

  constructor(
    widgetConfig: WidgetHelpers.WidgetConfig,
    data: object,
    configuration: WidgetHelpers.Configuration
  ) {
    this.widgetConfig = widgetConfig;
    this.configuration = configuration;
    this.data = data;
    this.schema = this.defaultTemplate();
  }

  private defaultTemplate() {
    return defaultVegaSchema();
  }

  private setScale() {
    const { value, chartType } = this.configuration;
    const { name } = value;
    const scale = this.widgetConfig.scales[0];

    if (chartType === "pie") {
      this.schema = {
        ...this.schema,
        scales: [
          ...this.schema.scales,
          {
            name: scale.name,
            type: "ordinal",
            domain: {
              ...scale.domain,
              field: name
            },
            range: { scheme: scale.range }
          }
        ]
      };
    }

    if (chartType === "bars") {
      this.schema = {
        ...this.schema,
        scales: [
          {
            name: "xscale",
            type: "band",
            domain: { data: "table", field: "name" },
            range: "width",
            padding: 0.05,
            round: true
          },
          {
            name: "yscale",
            domain: { data: "table", field: "estimated_generation_gwh" },
            nice: true,
            range: "height"
          }
        ]
      };
    }
  }

  private setMarks() {
    const { value, chartType } = this.configuration;

    if (chartType === "bars") {
      this.schema = {
        ...this.schema,
        marks: [
          {
            type: "rect",
            from: { data: "table" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "name" },
                width: { scale: "xscale", band: 1 },
                y: { scale: "yscale", field: "estimated_generation_gwh" },
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
        ]
      };
    } else {
      this.schema = {
        ...this.schema,
        marks: this.widgetConfig.marks.map(mark => {
          return {
            ...mark,
            encode: {
              ...mark.encode,
              enter: {
                ...mark.encode.enter,
                fill: {
                  ...mark.encode.fill,
                  scale: this.schema.scales[0].name,
                  field: value.name
                }
              }
            }
          };
        })
      };
    }
  }

  private setLegend() {
    this.schema = { ...this.schema, legend: this.widgetConfig.legend };
  }

  private setConfig() {
    this.schema = { ...this.schema, config: this.widgetConfig.config };
  }

  private setData() {
    const { chartType, value } = this.configuration;

    let transform = this.widgetConfig.data[0].transform.find(
      t => t.type === chartType
    );

    if (!transform) {
      transform = {
        type: "pie",
        field: value.name
      };
    }

    this.schema = {
      ...this.schema,
      data: [
        {
          values: this.data,
          name: this.widgetConfig.data[0].name,
          transform: [{ ...transform, field: value.name }]
        }
      ]
    };
  }

  private setAxes() {
    const { value, chartType } = this.configuration;

    if (chartType === "bars") {
      this.schema = {
        ...this.schema,
        axes: [
          { orient: "bottom", scale: "xscale" },
          { orient: "left", scale: "yscale" }
        ]
      };
    }
  }

  getVegaConfig() {
    this.setAxes();
    this.setScale();
    this.setMarks();
    this.setLegend();
    this.setConfig();
    this.setData();

    return this.schema;
  }
}

export default WidgetHelper;
