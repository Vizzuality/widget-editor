import { Adapter, Dataset, Widget } from "@widget-editor/types";
export default class RwAdapter implements Adapter.Service {
  endpoint: string;
  dataEndpoint: string;
  config: any;
  datasetService: any;
  widgetService: any;
  datasetId: any;
  tableName: any;
  AUTH_TOKEN: any;
  applications: string[];
  env: string;
  locale: string;
  widget_params: string[];
  constructor();
  payload(): {
    applications: string[];
    env: string;
  };
  private saveWidgetRW;
  private hasAuthToken;
  setDatasetId(datasetId: Adapter.datasetId): void;
  setTableName(tableName: string): void;
  getDataset(): Promise<any>;
  getFields(): Promise<any>;
  getWidget(dataset: Dataset.Payload, widgetId: Widget.Id): Promise<any>;
  getWidgetData(dataset: Dataset.Payload, widget: Widget.Payload): Promise<any>;
  getLayers(): Promise<any>;
  handleSave(
    consumerOnSave: any,
    dataService: any,
    application: string,
    editorState: any
  ): void;
  filterSerializer(filters: any): any;
  requestData(sql: any, dataset: any): Promise<any>;
  filterUpdate(
    filters: any,
    fields: any,
    widget: any,
    dataset: any
  ): Promise<any[]>;
}
