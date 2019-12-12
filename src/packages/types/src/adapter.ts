import Config from "./config";
import * as Payloads from "./payloads";

type Id = string | number;
type DatasetId = Id;
type WidgetId = Id;
type Endpoint = string;

export default interface Adapter {
  config: Config;
  endpoint: Endpoint;
  datasetId: Id;
  getDataset(datasetId: DatasetId): Promise<Payloads.Payloads.Dataset>;
  getWidget(widgetId: WidgetId): Promise<Payloads.Payloads.Widget>;
  getWidgetData(
    dataset: Payloads.Payloads.Dataset,
    widget: Payloads.Payloads.Widget
  ): Promise<[object]>;
}
