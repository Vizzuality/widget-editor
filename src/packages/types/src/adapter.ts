import * as Dataset from "./dataset";
import * as Widget from "./widget";
import * as Config from "./config";
import * as Generic from "./generic";
import * as Filters from "./filters";

type Id = string | number;
type WidgetId = Id;
type Endpoint = string;

export type datasetId = Id;

export interface Service {
  config: Config.Payload;
  endpoint: Endpoint;
  dataEndpoint: Endpoint;
  datasetId: datasetId;
  requestQue: any;
  isAborting: boolean;
  // Used when saving data
  // This will be grabbed and put into onSave on any request
  prepareRequest(url: string): Promise<any>;
  payload(): object;
  requestData({ configuration, filters, dataset }: { configuration: any, filters: Filters.Filter[], dataset: Dataset.Payload }): Promise<any>;
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
    fields: Generic.Array[],
    dataset: Dataset.Payload
  ): Promise<Filters.Filter[]>;
  getDeserializedScheme(config: any): Widget.Scheme;
}
