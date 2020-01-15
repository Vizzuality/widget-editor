interface WidgetPayloadData {
  name: string;
  transform: [
    {
      type: string;
      field?: string;
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
  type: string;
  from: {
    data: string;
  };
  encode: {
    enter: object;
    fill: {
      field: string;
    };
    update: {
      fill: { value: string };
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
      type?: string;
      domain?: object;
      range: { scheme: string } | string;
      padding?: number;
      round?: boolean;
      nice?: boolean;
    }>;
    config: object;
    legend: Array<object>;
    marks: Array<object>;
    axes: Array<object>;
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
