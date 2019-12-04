import { Config } from "@packages/types";

type Id = string | number;
type DatasetId = Id;
type WidgetId = Id;

interface Dataset {
  id: Id;
}
interface Widget {
  id: Id;
  dataset: Id;
}

export default interface Adapter {
  config: Config;
  getDataset(datasetId: DatasetId): Dataset;
  getWidget(widgetId: WidgetId): Widget;
}
