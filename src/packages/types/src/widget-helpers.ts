interface WidgetPayloadData {
  name: string;
  transform: [
    {
      type: string;
    }
  ];
  url: string;
  values: [object];
  format: {
    type: string;
    property: object;
  };
}

interface WidgetScalePayload {
  name: string;
  type: string;
  range: string;
  domain: object;
}

interface WidgetParamsConfigPayload {
  chartType: string;
  value: {
    name: string;
  };
}

interface MarkPayload {
  encode: {
    enter: object;
    fill: {
      field: string;
    };
  };
}

export namespace WidgetHelpers {
  export interface Configuration {
    chartType: string;
    value: {
      name: string;
    };
  }

  export interface WidgetConfig {
    paramsConfig: WidgetParamsConfigPayload;
    data: Array<WidgetPayloadData>;
    scales: Array<WidgetScalePayload>;
    marks: [MarkPayload];
    interaction_config: [object];
    legend: Array<object>;
    config: {
      axisY: object;
      axisX: object;
    };
  }

  export interface Schema {
    scales: Array<{
      name: string;
      type: string;
      domain: { field: string };
      range: { scheme: string };
    }>;
    config: object;
    legend: Array<object>;
    marks: Array<object>;
    data: Array<object>;
  }

  export interface WidgetHelper {
    schema: Schema;
    data: object;
    widgetConfig: WidgetConfig;
    configuration: Configuration;
    getVegaConfig(): object;
  }
}
