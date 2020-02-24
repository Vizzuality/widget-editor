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

  // TODO: add generic types for configuration and widget
  resolveUpdates(configuration: any, widget: any) {
    let widgetParams = {};

    this.adapter.widget_params.forEach(param => {
      if (param in configuration) {
        widgetParams = { ...widgetParams, [param]: configuration[param] };
      } else {
        // This can be displayed as info
        // As the user might just have miss-spelled a property.
        // We will inform them with a warning instead of throwing error
        // as the initial script will still work to populate params
        console.warn(
          `Widget Editor: Param(${param}) does not exsist in widget, make sure adapter.widget_params has fields that match with your API widget payload. Refer to documentation for adapter.widget_params for aditional information.`
        );
      }
    });

    const payload = {
      ...this.adapter.payload(),
      title: configuration.title,
      widget: {
        params: widgetParams,
        data: widget.data,
        scales: widget.scales,
        axes: widget.axes,
        marks: widget.marks,
        interaction_config: widget.interaction_config || null,
        config: widget.config
      }
    };

    return payload;
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getWidgetData();
    await this.getFieldsAndLayers();
  }
}
