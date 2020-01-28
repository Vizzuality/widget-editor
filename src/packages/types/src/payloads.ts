export namespace Payloads {
  type Id = string | number;

  export interface Widget {
    id: Id;
    type: string;
    attributes: {
      name: string;
      dataset: string;
      slug: string;
      description: string;
      application: [string];
      widgetConfig: {
        paramsConfig: object
      };
      defaultEditableWidget: boolean;
      env: string;
    };
  }

  export interface Dataset {
    attributes: {
      provider: string;
      tableName: string;
      widget: [Widget] | null;
    };
    id: Id;
  }
}
