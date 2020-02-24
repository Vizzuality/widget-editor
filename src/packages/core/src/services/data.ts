import { Dataset, Widget, Adapter, Generic } from "@packages/types";

import FiltersService from "./filters";
import { sagaEvents } from "../constants";

export default class DataService {
  adapter: Adapter.Service;
  dataset: Dataset.Payload;
  widget: Widget.Payload;
  cachedState: object;
  setEditor: Generic.Dispatcher;
  dispatch: Generic.Dispatcher;

  constructor(
    datasetId: Adapter.datasetId,
    adapter: Adapter.Service,
    setEditor: Generic.Dispatcher,
    dispatch: Generic.Dispatcher
  ) {
    this.adapter = adapter;
    this.setEditor = setEditor;
    this.dispatch = dispatch;
    this.dataset = null;
    this.widget = null;

    this.adapter.setDatasetId(datasetId);
  }

  async getDatasetAndWidgets() {
    console.log("Ds service", this.adapter);

    this.dataset = await this.adapter.getDataset();
    this.widget = await this.adapter.getWidget(this.dataset);

    this.setEditor({ dataset: this.dataset, widget: this.widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });
  }

  async getWidgetData() {
    const {
      attributes: {
        widgetConfig: { paramsConfig }
      }
    } = this.widget;

    // Construct correct SQL query based on widgetConfig
    const filtersService = new FiltersService(paramsConfig);
    const widgetData = await filtersService.requestWidgetData();

    this.setEditor({ widgetData: widgetData.data });
    this.dispatch({ type: sagaEvents.DATA_FLOW_WIDGET_DATA_READY });
  }

  async getFieldsAndLayers() {
    const fields = await this.adapter.getFields();
    const layers = await this.adapter.getLayers();

    this.setEditor({ layers, fields });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATA_READY });
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getWidgetData();
    await this.getFieldsAndLayers();
  }
}
