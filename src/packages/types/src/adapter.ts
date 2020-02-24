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
  getDataset(): Promise<Dataset.Payload>;
  getWidget(dataset: Dataset.Payload): Promise<Widget.Payload>;
  getFields(): Promise<[object]>;
  getLayers(): Promise<[object]>;
  getWidgetData(
    dataset: Dataset.Payload,
    widget: Widget.Payload
  ): Promise<[object]>;
  preSaveWidget(): void;
  setDatasetId(datasetId: datasetId): void;
  saveWidget(): object;
}
