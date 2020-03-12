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

  // Used when saving data
  // Specify what parameters from your widget api payload youre interested in
  // So we can serialize the data in a clean way
  widget_params: string[];
  // Used when saving data
  // This will be grabbed and put into onSave on any request
  payload(): object;

  getDataset(): Promise<Dataset.Payload>;
  getWidget(dataset: Dataset.Payload): Promise<Widget.Payload>;
  getFields(): Promise<[object]>;
  getLayers(): Promise<[object]>;
  getWidgetData(
    dataset: Dataset.Payload,
    widget: Widget.Payload
  ): Promise<[object]>;
  setDatasetId(datasetId: datasetId): void;
  handleFilters(filters: any): void;
}
