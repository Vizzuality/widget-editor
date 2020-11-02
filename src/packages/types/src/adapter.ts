import * as Dataset from "./dataset";
import * as Widget from "./widget";
import * as Layer from "./layer";
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
  getDatasetData(sql: string): Promise<Dataset.Data['data']>;
  getDataUrl(): string;
  requestData(store: any): Promise<any>;
  getDataset(): Promise<Dataset.Payload>;
  extendProperties(prop: any): void;
  getWidget(
    dataset: Dataset.Payload,
    widget: Widget.Id
  ): Promise<Widget.Payload>;
  getFields(): Promise<[object]>;
  getLayers(): Promise<[object]>;
  getLayer(layerId: Layer.Id): Promise<Layer.Payload>;
  getLayerTileUrl(layerId: Layer.Id, provider: Layer.Provider): string;
  setDatasetId(datasetId: datasetId): void;
  getSerializedScheme(config: Widget.Scheme): any;
  getDeserializedScheme(config: any): Widget.Scheme;
  getPredefinedAreas(): Promise<{ id: Id, name: string }[]>;
}
