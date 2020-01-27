import { Adapter, Payloads } from "@packages/types";

import FiltersService from "./filters";

import { sagaEvents } from "../constants";

export default class Data {
  adapter: Adapter;
  dataset: Payloads.Dataset;
  widget: Payloads.Widget;
  cachedState: object;
  setEditor: Function;
  dispatch: Function;

  constructor(adapter: Adapter, setEditor: Function, dispatch: Function) {
    this.adapter = adapter;
    this.setEditor = setEditor;
    this.dispatch = dispatch;
    this.dataset = null;
    this.widget = null;
  }

  private async getDatasetAndWidgets() {
    this.dataset = await this.adapter.getDataset();
    this.widget = await this.adapter.getWidget(this.dataset);

    this.setEditor({ dataset: this.dataset, widget: this.widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });
  }

  private async getWidgetData() {
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

  private async getFieldsAndLayers() {
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
