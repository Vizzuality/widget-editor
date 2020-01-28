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
  getDataset(): Promise<Payloads.Payloads.Dataset>;
  getWidget(dataset: Payloads.Payloads.Dataset): Promise<Payloads.Payloads.Widget>;
  getFields(): Promise<[object]>;
  getLayers(): Promise<[object]>
  getWidgetData(
    dataset: Payloads.Payloads.Dataset,
    widget: Payloads.Payloads.Widget
  ): Promise<[object]>;
}
