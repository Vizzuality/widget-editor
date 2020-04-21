export type Id = string | number | null;

export interface Payload {
  id: Id;
  type: string;
  paramsConfig: any;
  attributes: {
    name: string;
    dataset: string;
    slug: string;
    description: string;
    application: [string];
    widgetConfig: {
      paramsConfig: any;
    };
    defaultEditableWidget: boolean;
    env: string;
  };
}

export interface Service {
  fromDataset(dataset: object): object;
  getDataSqlQuery(dataset: any, widget: any): string;
  fetchWidgetData(url: string): Promise<[object]>;
  fetchWidget(widgetId: Id): Promise<Payload>;
}
