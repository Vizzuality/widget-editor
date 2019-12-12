type Id = string | number;

import * as Payloads from "./payloads";

export default interface Widget {
  fromDataset(dataset: object): object;
  getDataSqlQuery(dataset: any, widget: any): string;
  fetchWidgetData(url: string): Promise<[object]>;
  fetchWidget(widgetId: Id): Promise<Payloads.Payloads.Widget>;
}
