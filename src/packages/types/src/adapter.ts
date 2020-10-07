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
  datasetId: datasetId;
  requestQue: any;
  isAborting: boolean;
  getName(): string;
  // Used when saving data
  // This will be grabbed and put into onSave on any request
  prepareRequest(url: string): Promise<any>;
  payload(): object;
  requestData(store: any): Promise<any>;
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
  getSerializedScheme(config: Widget.Scheme): any;
  getDeserializedScheme(config: any): Widget.Scheme;
}
