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
    widgetConfig: WidgetConfig;
    defaultEditableWidget: boolean;
    env: string;
  };
}

export type WidgetConfig = any;

export type Scheme = {
  name: string;
  mainColor: string;
  category: string[];
};

export interface Service {
  fetchWidget(widgetId: Id): Promise<Payload>;
}
