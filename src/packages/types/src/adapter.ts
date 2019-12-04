import Config from "./config";

type Id = string | number;
type DatasetId = Id;
type WidgetId = Id;
type Endpoint = string;

interface Dataset {
  id: Id;
}

interface Widget {
  id: Id;
  dataset: Id;
}

interface AdapterState {
  dataset: Dataset;
  widget: Widget;
}

export default interface Adapter {
  config: Config;
  endpoint: Endpoint;
  datasetId: Id;
  getDataset(datasetId: DatasetId): Promise<Dataset>;
  getWidget(widgetId: WidgetId): Promise<Widget>;
  resolveAdapterState(): Promise<AdapterState>;
}
