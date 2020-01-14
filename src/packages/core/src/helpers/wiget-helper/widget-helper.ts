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
    const { value } = this.configuration;
    const { name } = value;
    const scale = this.widgetConfig.scales[0];
    if (scale.type === "ordinal") {
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
  }

  private setMarks() {
    const { value } = this.configuration;

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

  private setLegend() {
    this.schema = { ...this.schema, legend: this.widgetConfig.legend };
  }

  private setConfig() {
    this.schema = { ...this.schema, config: this.widgetConfig.config };
  }

  private setData() {
    const { chartType, value } = this.configuration;

    const transform = this.widgetConfig.data[0].transform.find(
      t => t.type === chartType
    );

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

  getVegaConfig() {
    this.setScale();
    this.setMarks();
    this.setLegend();
    this.setConfig();
    this.setData();

    return this.schema;
  }
}

export default WidgetHelper;
