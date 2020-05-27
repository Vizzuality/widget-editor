export type Id = string | number | null;

export interface Payload {
  id: Id;
  type: string;
  paramsConfig: any;
  interaction_config: any;
  attributes: {
    name: string;
    dataset: string;
    slug: string;
    description: string;
    application: [string];
    widgetConfig: {
      value: any;
      category: any;
      paramsConfig: any;
    };
    defaultEditableWidget: boolean;
    env: string;
  };
}

export interface Service {
  fromDataset(dataset: object): object;
  fetchWidget(widgetId: Id): Promise<Payload>;
}
