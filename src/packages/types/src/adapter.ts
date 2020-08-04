import * as Dataset from "./dataset";
import * as Widget from "./widget";
import * as Config from "./config";

type Id = string | number;
type WidgetId = Id;
type Endpoint = string;

export type datasetId = Id;

export interface Service {
  config: Config.Payload;
  endpoint: Endpoint;
  dataEndpoint: Endpoint;
  datasetId: datasetId;
  // Used when saving data
  // This will be grabbed and put into onSave on any request
  payload(): object;
  requestData({ configuration, filters, dataset }: { configuration: any, filters: any, dataset: Dataset.Payload }): Promise<any>;
  getDataset(): Promise<Dataset.Payload>;
  extendProperties(prop: any): void;
  getWidget(
    dataset: Dataset.Payload,
    widget: Widget.Id
  ): Promise<Widget.Payload>;
  getFields(): Promise<[object]>;
  getDataUrl(): string;
  getLayers(): Promise<[object]>;
  setDatasetId(datasetId: datasetId): void;
  getDeserializedFilters(
    filters: any[],
    fields: any[],
    dataet: Dataset.Payload
  ): Promise<any[]>;
}
