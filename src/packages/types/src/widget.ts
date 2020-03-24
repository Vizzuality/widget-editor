export type Id = string | number | null;

export interface Payload {
  id: Id;
  type: string;
  attributes: {
    name: string;
    dataset: string;
    slug: string;
    description: string;
    application: [string];
    widgetConfig: {
      paramsConfig: object;
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
