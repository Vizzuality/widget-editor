import { Adapter, Payloads } from "@packages/types";

import { sagaEvents } from '../constants';

export default class Data {
  adapter: Adapter;
  setEditor: Function;
  dispatch: Function;

  constructor(adapter: Adapter, setEditor: Function, dispatch: Function) {
    this.adapter = adapter;
    this.setEditor = setEditor;
    this.dispatch = dispatch;
  }
    
  private async getDatasetAndWidgets() {
    const dataset: Payloads.Dataset = await this.adapter.getDataset();
    const widget: Payloads.Widget = await this.adapter.getWidget(dataset);

    this.setEditor({ dataset, widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });

    const widgetData = await this.adapter.getWidgetData(dataset, widget);

    this.setEditor({ widgetData });
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
    await this.getFieldsAndLayers();
  }

}
